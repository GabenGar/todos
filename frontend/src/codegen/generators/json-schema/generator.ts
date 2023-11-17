import path from "node:path";
import { readFile } from "node:fs/promises";
import stringifyObject from "stringify-object";
// @TODO import from a core lib once it's implemented
import { reduceFolder } from "../../../../../codegen/dist/src/lib/fs/index.js";
import type {
  IGeneratedNestedModule,
  IModuleInfo,
} from "../../../../../codegen/src/codegen/types.js";

const schemaFolderPath = path.resolve("../schema");
const schemaFileExtension = ".schema.json";

/**
 * The key is the path to the schema file relative
 * to schema folder.
 */
interface ISchemaMap extends Map<string, ISchema> {}
interface ISchema {
  $id: string;
}

async function generateJSONSchemas(): Promise<IGeneratedNestedModule> {
  const schemas = await getSchemas();

  const moduleMap = toNestedModules(schemas);

  const nestedModule: IGeneratedNestedModule = {
    type: "nested",
    name: "json-schema",
    moduleMap,
  };

  return nestedModule;
}

async function getSchemas(): Promise<ISchemaMap> {
  const schemaMap = await reduceFolder<ISchemaMap>(
    schemaFolderPath,
    new Map(),
    async (schemaMap, entry, entryPath) => {
      if (!entry.isFile() || !entry.name.endsWith(schemaFileExtension)) {
        return schemaMap;
      }

      const content = await readFile(entryPath, { encoding: "utf8" });
      const schema: ISchema = JSON.parse(content);
      const moduleName = path.join(
        path.dirname(entryPath),
        path.basename(entryPath, schemaFileExtension),
      );
      const schemaPath = path.relative(schemaFolderPath, moduleName);

      schemaMap.set(schemaPath, schema);

      return schemaMap;
    },
  );

  return schemaMap;
}

function toNestedModules(
  schemaMap: ISchemaMap,
): IGeneratedNestedModule["moduleMap"] {
  const moduleMap = Array.from(schemaMap.entries()).reduce<
    IGeneratedNestedModule["moduleMap"]
  >((moduleMap, [schemaPath, schema]) => {
    const schemaModule = createSchemaModule(schema);
    const moduleInfos: IModuleInfo[] = [schemaModule];

    moduleMap.set(schemaPath, moduleInfos);

    return moduleMap;
  }, new Map());

  return moduleMap;
}

function createSchemaModule(schema: ISchema): IModuleInfo {
  const content = `export const schema = ${stringifyObject(schema)} as const`;
  const moduleExports: IModuleInfo["exports"] = [
    { name: "schema", type: "concrete" },
  ];

  const moduleInfo: IModuleInfo = {
    name: "schema",
    content,
    exports: moduleExports,
  };

  return moduleInfo;
}

export default generateJSONSchemas;
