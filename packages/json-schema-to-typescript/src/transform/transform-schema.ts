import { NEWLINE, createMultiLineString } from "#strings";
import { validateJSONSchemaDocument } from "./document.js";
import { createSymbolJSDoc } from "./jsdoc.js";
import type { IJSONSchemaObject, IJSONSchemaDocument } from "./types.js";

export function transformSchemaToInterface(
	schema: Readonly<IJSONSchemaObject>,
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
				`Unreachable path for symbol kind "${symbolKind satisfies never}"`,
			);
		}
	}

	return moduleContent;
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
			if (schema.enum) {
				body = createEnumBody(schema.enum, isSymbolDeclaration);
				break;
			}

			if (schema.const) {
				body = createConstBody(schema.const, isSymbolDeclaration);
				break;
			}

			if (schema.allOf) {
				body = createAllOfBody(schema.allOf, isSymbolDeclaration);
				break;
			}

			if (schema.anyOf) {
				body = createAnyOfBody(schema.anyOf, isSymbolDeclaration);
				break;
			}

			if (schema.oneOf) {
				body = createOneOfBody(schema.oneOf, isSymbolDeclaration);
				break;
			}

			throw new Error(
				`Schemas without type must be composite or have "enum" or "const" keyword`,
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

function createEnumBody(
	enumValue: Required<IJSONSchemaDocument>["enum"],
	isSymbolDeclaration = false,
) {
	const bodyLiterals = enumValue.map((value) => JSON.stringify(value));
	const body = bodyLiterals.join("|");

	return body;
}

function createConstBody(
	constValue: Required<IJSONSchemaDocument>["const"],
	isSymbolDeclaration = false,
) {
	const body = JSON.stringify(constValue);

	return body;
}

function createAllOfBody(
	allOf: Required<IJSONSchemaDocument>["allOf"],
	isSymbolDeclaration = false,
) {
	const types = allOf.map((schema) => {
		// @ts-expect-error fix the underlying schema type
		const body = schema === true ? "unknown" : toTypeBody(schema);

		return body;
	});
	const body = types.join("&");

	return body;
}

function createAnyOfBody(
	anyOf: Required<IJSONSchemaDocument>["anyOf"],
	isSymbolDeclaration = false,
) {
	const types = anyOf.map((schema) => {
		// @ts-expect-error fix the underlying schema type
		const body = schema === true ? "unknown" : toTypeBody(schema);

		return body;
	});
	const body = types.join("|");

	return body;
}

function createOneOfBody(
	oneOf: Required<IJSONSchemaDocument>["oneOf"],
	isSymbolDeclaration = false,
) {
	const types = oneOf.map((schema) => {
		// @ts-expect-error fix the underlying schema type
		const body = schema === true ? "unknown" : toTypeBody(schema);

		return body;
	});
	const body = types.join("|");

	return body;
}
