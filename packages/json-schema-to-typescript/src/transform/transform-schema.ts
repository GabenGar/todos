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
	const symbolBody = toTypeBody(schema);
	const symbolKind = guessSymbolKind(schema);

	let moduleContent: string;

	switch (symbolKind) {
		case "interface": {
			moduleContent = `export interface ${symbolName} ${symbolBody};`;
			break;
		}
		case "type": {
			moduleContent = `export type ${symbolName} = ${symbolBody};`;
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
			body = "{}";
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
	if (schema.type === "object") {
		return "interface";
	}

	return "type";
}
