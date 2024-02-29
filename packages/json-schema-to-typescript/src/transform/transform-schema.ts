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
	const symbolBody = toTypeBody(schema);
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

	if (examples) {
		inputLines.push(...examples);
	}

	const jsdocComment = createJSDoc(...inputLines);

	return jsdocComment;
}

/**
 * @TODO separate schema type for subschemas
 */
function toTypeBody(schema: IJSONSchemaDocument): string {
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
			body = createObjectBody(schema);
			break;
		}
		case "array": {
			body = "extends Array<unknown> {}";
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
	if (schema.type === "object" || schema.type === "array") {
		return "interface";
	}

	return "type";
}

function createObjectBody(schema: IJSONSchemaDocument) {
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

	const lines = ["{"];
	if (properties) {
		lines.push(...properties);
	}

	if (additionalProperties) {
		if (additionalProperties !== true) {
			throw new Error(`Unsupported "additionalProperties" value.`);
		}

		lines.push("[index: string]: unknown;");
	}
	lines.push("}");

	const body = createMultiLineString(...lines);

	return body;
}
