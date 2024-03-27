import { NEWLINE, createMultiLineString } from "#strings";
import { validateJSONSchemaDocument } from "./validate.js";
import { createSymbolJSDoc } from "./jsdoc.js";
import { toTypeBody } from "./transform-schema.js";
import { collectDocumentRefs, createRefMapping } from "./refs.js";
import type {
	IJSONSchemaObject,
	IJSONSchemaDocument,
	IRefMap,
	IGetSchemaDocument,
} from "./types.js";

export function transformSchemaDocumentToModule(
	schemaDocument: Readonly<IJSONSchemaDocument>,
	getExternalDocument?: IGetSchemaDocument,
): string {
	validateJSONSchemaDocument(schemaDocument);

	const documentRefs = collectDocumentRefs(
		schemaDocument,
		getExternalDocument !== undefined,
	);
	const refMap = createRefMapping(
		schemaDocument,
		new Set(...documentRefs.local, ...documentRefs.external),
		getExternalDocument,
	);

	const symbols = createDocumentSymbols(schemaDocument, refMap);

	return createMultiLineString(...symbols);
}

function createDocumentSymbols(
	schemaDocument: Readonly<IJSONSchemaDocument>,
	refMap: IRefMap,
): string[] {
	const documentSymbolDeclaration = createSymbolDeclaration(
		schemaDocument,
		refMap,
		true,
	);
	// a dirty hack to retain an extra newline between
	// core export and internal symbols
	const symbols: string[] = [documentSymbolDeclaration, NEWLINE];

	for (const [ref, { symbolName, schema }] of refMap) {
		if (!ref.startsWith("#")) {
			continue;
		}

		const declaraton = createSymbolDeclaration(schema, refMap, false);

		symbols.push(declaraton);
	}

	return symbols;
}

function createSymbolDeclaration(
	schema: IJSONSchemaObject,
	refMap: IRefMap,
	isExportable: boolean,
): string {
	const name = `I${schema.title}`;
	const jsDocComment = createSymbolJSDoc(schema);
	const isInterface =
		schema.type === "object" ||
		(schema.type === "array" && !schema.prefixItems);
	const body = toTypeBody(schema, refMap, true);
	const exportKeyword = isExportable ? "export" : "";

	if (isInterface) {
		return `${
			!jsDocComment ? "" : `${jsDocComment}${NEWLINE}`
		}${exportKeyword} interface ${name} ${body};`;
	}

	return `${
		!jsDocComment ? "" : `${jsDocComment}${NEWLINE}`
	}${exportKeyword} type ${name} = ${body};`;
}
