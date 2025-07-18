import { NEWLINE, createMultiLineString } from "#strings";
import { createSymbolJSDoc } from "./jsdoc.js";
import { collectDocumentRefs, createRefMapping } from "./refs.js";
import { toTypeBody } from "./transform-schema.js";
import type {
  IDocumentRefs,
  IGetModuleData,
  IGetSchemaDocument,
  IJSONSchemaDocument,
  IJSONSchemaObject,
  IRefMap,
} from "./types.js";
import { validateJSONSchemaDocument } from "./validate.js";

export function transformSchemaDocumentToModule(
  schemaDocument: Readonly<IJSONSchemaDocument>,
  getExternalDocument?: IGetSchemaDocument,
  getModuleData?: IGetModuleData,
): string {
  validateJSONSchemaDocument(schemaDocument);

  const documentRefs = collectDocumentRefs(
    schemaDocument,
    getExternalDocument !== undefined,
  );

  const mergedRefs = union(documentRefs.local, documentRefs.external);

  const refMap = createRefMapping(
    schemaDocument,
    mergedRefs,
    getExternalDocument,
  );

  const moduleImports = createModuleImports(
    schemaDocument,
    documentRefs.external,
    getModuleData,
  );
  const symbols = createDocumentSymbols(schemaDocument, refMap);

  return createMultiLineString(...moduleImports, NEWLINE, ...symbols);
}

function createModuleImports(
  schemaDocument: Readonly<IJSONSchemaDocument>,
  externalRefs: IDocumentRefs,
  getModuleData?: IGetModuleData,
): string[] {
  if (externalRefs.size !== 0 && !getModuleData) {
    throw new Error(
      `Schema document "${schemaDocument.$id}" has external references but no module resolution function was provided.`,
    );
  }

  const moduleImports: string[] = [];

  for (const ref of externalRefs) {
    // biome-ignore lint/style/noNonNullAssertion: it just works
    const { symbolName, modulePath } = getModuleData!(schemaDocument.$id, ref);
    const importStatement = `import type {${symbolName}} from "${modulePath}";`;

    moduleImports.push(importStatement);
  }

  return moduleImports;
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

  for (const [ref, { schema }] of refMap) {
    if (!ref.startsWith("#") || ref === "#") {
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

/**
 * Stolen from
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations
 */
function union<AType, BType>(
  setA: Set<AType>,
  setB: Set<BType>,
): Set<AType | BType> {
  const result: Set<AType | BType> = new Set(setA);

  for (const elem of setB) {
    result.add(elem);
  }

  return result;
}
