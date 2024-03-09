import { createJSDoc } from "#codegen";
import { NEWLINE, createMultiLineString } from "#strings";
import type {
	IJSONSchema,
	IJSONSchemaDocument,
	IJSONSchemaType,
} from "./types.js";

export function transformSchemaToInterface(
	schema: Readonly<IJSONSchema>,
): string {
	validateJSONSchemaDocument(schema);

	const symbolName = `I${schema.title}`;
	const jsDocComment = createSymbolJSDoc(schema);
	const symbolBody = toTypeBody(schema, true);
	const symbolKind = guessSymbolKind(schema);

	let moduleContent: string;

	switch (symbolKind) {
		case "interface": {
			moduleContent = `${
				!jsDocComment ? "" : `${jsDocComment}${NEWLINE}`
			}export interface ${symbolName} ${symbolBody};`;
			break;
		}
		case "type": {
			moduleContent = `${
				!jsDocComment ? "" : `${jsDocComment}${NEWLINE}`
			}export type ${symbolName} = ${symbolBody};`;
			break;
		}

		default: {
			throw new Error(
				`Unreachable path for value "${symbolKind satisfies never}"`,
			);
		}
	}

	return moduleContent;
}

function validateJSONSchemaDocument(
	schema: IJSONSchema,
): asserts schema is IJSONSchemaDocument {
	if (
		!("title" in schema) ||
		typeof schema.title !== "string" ||
		schema.title.trim().length === 0
	) {
		throw new Error("Schema document must have a non-empty title.");
	}

	if (!("type" in schema) || !isJSONSchemaTypeString(schema.type)) {
		throw new Error("Schema document must have a known type.");
	}
}

const schemaTypes = [
	"string",
	"number",
	"boolean",
	"object",
	"array",
	"null",
	"integer",
] as const satisfies IJSONSchemaType[];

function isJSONSchemaTypeString(input: unknown): input is IJSONSchemaType {
	if (!schemaTypes.includes(input as IJSONSchemaType)) {
		return false;
	}

	return true;
}

function createSymbolJSDoc(schema: IJSONSchemaDocument): string | undefined {
	const inputLines = [schema.description?.trim()];
	const examples = schema.examples?.flatMap((example) => [
		"@example",
		"```json",
		JSON.stringify(example, undefined, 2),
		"```",
	]);
	const defaultValue =
		schema.default === undefined
			? undefined
			: createMultiLineString(
					"@default",
					"```json",
					JSON.stringify(schema.default, undefined, 2),
					"```",
			  );

	if (examples) {
		inputLines.push(...examples);
	}

	if (defaultValue) {
		inputLines.push(defaultValue);
	}

	const jsdocComment = createJSDoc(...inputLines);

	return jsdocComment;
}

/**
 * @TODO separate schema type for subschemas
 */
function toTypeBody(
	schema: IJSONSchemaDocument,
	isSymbolDeclaration = false,
): string {
	let body: string;

	switch (schema.type) {
		case "null": {
			body = "null";
			break;
		}
		case "boolean": {
			body = "boolean";
			break;
		}
		case "integer": {
			body = "number";
			break;
		}
		case "number": {
			body = "number";
			break;
		}
		case "string": {
			body = "string";
			break;
		}
		case "object": {
			body = createObjectBody(schema, isSymbolDeclaration);
			break;
		}
		case "array": {
			body = createArrayBody(schema, isSymbolDeclaration);
			break;
		}

		default: {
			throw new Error(
				`Unreachable path for value "${schema.type satisfies never}"`,
			);
		}
	}

	return body;
}

function guessSymbolKind(schema: IJSONSchemaDocument): "interface" | "type" {
	if (
		schema.type === "object" ||
		(schema.type === "array" && !schema.prefixItems)
	) {
		return "interface";
	}

	return "type";
}

export function createObjectBody(
	schema: IJSONSchemaDocument,
	isSymbolDeclaration = false,
) {
	const requiredProperties = schema.required;

	const properties =
		schema.properties &&
		Object.entries(schema.properties).map<string>(
			([propertyName, propertySchema]) => {
				const fieldName = requiredProperties?.includes(propertyName)
					? propertyName
					: `${propertyName}?`;
				// @ts-expect-error fix the underlying schema type
				return `${fieldName}: ${toTypeBody(propertySchema)};`;
			},
		);

	/**
	 * As per [docs](https://json-schema.org/understanding-json-schema/reference/object#additionalproperties):
	 * > By default any additional properties are allowed.
	 */
	const additionalProperties = schema.additionalProperties ?? true;
	const isRecordSchema = additionalProperties && !properties;

	if (isRecordSchema) {
		const body = createRecordBody(isSymbolDeclaration);

		return body;
	}

	const lines = ["{"];

	if (properties) {
		lines.push(...properties);
	}

	if (additionalProperties) {
		if (additionalProperties !== true) {
			throw new Error(`Unsupported "additionalProperties" value.`);
		}

		if (isSymbolDeclaration) {
			lines.unshift("extends Record<string, unknown>");
		} else {
			lines.push("[index: string]: unknown;");
		}
	}

	lines.push("}");

	const body = createMultiLineString(...lines);

	return body;
}

function createRecordBody(isSymbolDeclaration = false) {
	return isSymbolDeclaration
		? "extends Record<string, unknown> {}"
		: "Record<string, unknown>";
}

function createArrayBody(
	schema: IJSONSchemaDocument,
	isSymbolDeclaration = false,
): string {
	const itemsSchema = schema.items;
	const prefixItems = schema.prefixItems;
	const contains = schema.contains;
	const containsType =
		// @ts-expect-error fix the underlying schema type
		contains && (contains === true ? "unknown" : toTypeBody(contains));
	let itemType = "unknown";

	if (prefixItems) {
		const types = prefixItems.map((schema) => {
			// @ts-expect-error fix the underlying schema type
			const typeBody = schema === true ? "unknown" : toTypeBody(schema);

			return typeBody;
		});

		const extraItems = schema.items ?? true;

		if (extraItems) {
			if (extraItems === true) {
				types.push("...unknown[]");
			} else {
				// @ts-expect-error fix the underlying schema type
				types.push(`...(${toTypeBody(extraItems)})[]`);
			}
		}

		const body = `[${types.join(",")}]`;

		return body;
	}

	if (itemsSchema && itemsSchema !== true) {
		// @ts-expect-error fix the underlying schema type
		const typeBody = toTypeBody(itemsSchema);
		itemType = !containsType ? typeBody : `${typeBody} | ${containsType}`;
	}

	const body = isSymbolDeclaration
		? `extends Array<${itemType}> {}`
		: `Array<${itemType}>`;

	return body;
}
