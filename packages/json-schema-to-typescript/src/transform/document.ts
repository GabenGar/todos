import {
	isJSONSchemaTypeString,
	type IJSONSchema,
	type IJSONSchemaDocument,
} from "./types.js";

type ISchemaRef = Required<IJSONSchemaDocument>["$ref"];

export function transformSchemaDocumentToType(
	schemaDocument: Readonly<IJSONSchema>,
): string {
	validateJSONSchemaDocument(schemaDocument);

	const documentRefs = collectDocumentRefs(schemaDocument);
}

function validateJSONSchemaDocument(
	schema: IJSONSchema,
): asserts schema is IJSONSchemaDocument {
	const isValidSchemaID =
		"$id" in schema &&
		typeof schema.title === "string" &&
		schema.title.trim().length !== 0;

	if (!isValidSchemaID) {
		throw new Error(`Schema document must have a non-empty "$id".`);
	}

	const isValidTitle =
		"title" in schema &&
		typeof schema.title === "string" &&
		schema.title.trim().length !== 0;

	if (!isValidTitle) {
		throw new Error(`Schema document must have a non-empty "title".`);
	}

	const isValidType = "type" in schema && isJSONSchemaTypeString(schema.type);
	const isEnum = "enum" in schema && Array.isArray(schema.enum);
	const isConst = "const" in schema;
	const isComposite =
		("allOf" in schema && Array.isArray(schema.allOf)) ||
		("anyOf" in schema && Array.isArray(schema.anyOf)) ||
		("oneOf" in schema && Array.isArray(schema.oneOf));
	const isValidShape = isValidType || isEnum || isConst || isComposite;

	if (!isValidShape) {
		throw new Error(
			"Schema document must have a known type or be a enum or a const.",
		);
	}
}

function collectDocumentRefs(
	schemaDocument: IJSONSchemaDocument,
): Set<ISchemaRef> {
	const documentRefs = collectSchemaRefs(schemaDocument, new Set<ISchemaRef>());

	return documentRefs;
}

function collectSchemaRefs(
	schema: IJSONSchema,
	documentRefs: Set<ISchemaRef>,
): Set<ISchemaRef> {
	if (schema.$ref) {
		documentRefs.add(schema.$ref);
	}

	return documentRefs;
}
