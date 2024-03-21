import { get as getValueFromPointer } from "@hyperjump/json-pointer";
import {
	isJSONSchemaTypeString,
	type IJSONSchemaObject,
	type IJSONSchemaDocument,
} from "./types.js";

type ISchemaRef = Required<IJSONSchemaDocument>["$ref"];
interface IDocumentRefs extends Set<ISchemaRef> {}
/**
 * A mapping of `"$ref"`s and the symbol names.
 */
interface IRefMap extends Map<ISchemaRef, string> {}

export function transformSchemaDocumentToType(
	schemaDocument: Readonly<IJSONSchemaObject>,
): string {
	validateJSONSchemaDocument(schemaDocument);

	const documentRefs = collectDocumentRefs(schemaDocument);
	const refMap = createRefMapping(schemaDocument, documentRefs);
}

/**
 * @TODO unexport it
 */
export function validateJSONSchemaDocument(
	schema: IJSONSchemaObject,
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
			"Schema document must have a known type or a enum or a const or a composite.",
		);
	}
}

function collectDocumentRefs(
	schemaDocument: IJSONSchemaDocument,
): IDocumentRefs {
	const documentRefs = collectSchemaRefs(schemaDocument, new Set<ISchemaRef>());

	// validate refs
	documentRefs.forEach((ref) => {
		const isLocalRef = ref.startsWith("#");
		if (!isLocalRef) {
			throw new Error(`External \`"$ref"\` "${ref}" is not supported.`);
		}

		const isValidLocalRef = ref.startsWith("/$defs");

		if (!isValidLocalRef) {
			throw new Error(`Local \`"$ref"\` "${ref}" is not valid.`);
		}
	});

	return documentRefs;
}

function collectSchemaRefs(
	schema: IJSONSchemaObject,
	documentRefs: IDocumentRefs,
): IDocumentRefs {
	if (schema.$ref) {
		documentRefs.add(schema.$ref);
	}

	if (schema.properties) {
		Object.values(schema.properties).forEach((schema) => {
			if (typeof schema === "boolean") {
				return;
			}

			collectSchemaRefs(schema, documentRefs);
		});
	}

	if (schema.items && schema.items !== true) {
		collectSchemaRefs(schema.items, documentRefs);
	}

	return documentRefs;
}

function createRefMapping(
	schemaDocument: IJSONSchemaDocument,
	documentRefs: IDocumentRefs,
): IRefMap {
	const refMap: IRefMap = new Map();

	for (const ref of documentRefs) {
		const schema = getValueFromPointer(ref, schemaDocument);
		const isValidSchema = typeof schema === "object" && schema !== null;

		if (!isValidSchema) {
			throw new Error(
				`The ref "${ref}" at schema document "${schemaDocument.$id}" does not point to schema object.`,
			);
		}

		const parsedTitle =
			"title" in schema &&
			typeof schema.title === "string" &&
			schema.title.trim().length !== 0
				? schema.title.trim()
				: undefined;

		if (!parsedTitle) {
			throw new Error(
				`The ref "${ref}" at schema document "${schemaDocument.$id}" does not have a "title" property.`,
			);
		}

		const symbolName = `I${parsedTitle}`;

		refMap.set(ref, symbolName);
	}

	return refMap;
}
