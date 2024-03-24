import { get as getValueFromPointer } from "@hyperjump/json-pointer";
import { NEWLINE, createMultiLineString } from "#strings";
import {
	validateJSONSchemaDocument,
	validateJSONSchemaObject,
} from "./validate.js";
import { type IJSONSchemaObject, type IJSONSchemaDocument } from "./types.js";
import { createSymbolJSDoc } from "./jsdoc.js";
import { toTypeBody } from "./transform-schema.js";

type ISchemaRef = Required<IJSONSchemaDocument>["$ref"];
interface IDocumentRefs extends Set<ISchemaRef> {}
/**
 * A mapping of `"$ref"`s and schemas with their symbol names.
 */
interface IRefMap
	extends Map<ISchemaRef, { symbolName: string; schema: IJSONSchemaObject }> {}

export function transformSchemaDocumentToModule(
	schemaDocument: Readonly<IJSONSchemaDocument>,
): string {
	validateJSONSchemaDocument(schemaDocument);

	const documentRefs = collectDocumentRefs(schemaDocument);
	const refMap = createRefMapping(schemaDocument, documentRefs);
	const symbols = createDocumentSymbols(schemaDocument, refMap);

	return createMultiLineString(...symbols);
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
		validateJSONSchemaObject(schema);

		const parsedTitle = schema.title?.trim();

		if (!parsedTitle) {
			throw new Error(
				`The ref "${ref}" at schema document "${schemaDocument.$id}" does not have a "title" property.`,
			);
		}

		const symbolName = `I${parsedTitle}`;

		refMap.set(ref, { symbolName, schema });
	}

	return refMap;
}

function createDocumentSymbols(
	schemaDocument: Readonly<IJSONSchemaDocument>,
	refMap: IRefMap,
): string[] {
	const documentSymbolDeclaration = createSymbolDeclaration(schemaDocument);
	const symbols: string[] = [documentSymbolDeclaration];

	for (const [ref, { symbolName, schema }] of refMap) {
		const declaraton = createSymbolDeclaration(schema);

		symbols.push(declaraton);
	}

	return symbols;
}

function createSymbolDeclaration(schema: IJSONSchemaObject): string {
	const name = `I${schema.title}`;
	const jsDocComment = createSymbolJSDoc(schema);
	const isInterface =
		schema.type === "object" ||
		(schema.type === "array" && !schema.prefixItems);
	const body = toTypeBody(schema, true);

	if (isInterface) {
		return `${
			!jsDocComment ? "" : `${jsDocComment}${NEWLINE}`
		}export interface ${name} ${body};`;
	}

	return `${
		!jsDocComment ? "" : `${jsDocComment}${NEWLINE}`
	}export type ${name} = ${body};`;
}
