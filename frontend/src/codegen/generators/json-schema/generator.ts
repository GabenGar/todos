import path from "node:path";
import { readFile } from "node:fs/promises";
import stringifyObject from "stringify-object";
import { compile } from "json-schema-to-typescript";
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
  const moduleMap = await toNestedModules(schemas);

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

async function toNestedModules(
  schemaMap: ISchemaMap,
): Promise<IGeneratedNestedModule["moduleMap"]> {
  const moduleMap: IGeneratedNestedModule["moduleMap"] = new Map();
  const options: Parameters<typeof compile>["2"] = {
    format: false,
    bannerComment: "",
    cwd: schemaFolderPath,
    enableConstEnums: false,
    declareExternallyReferenced: false,
    $refOptions: {
      resolve: {
        http: false,
        file: {
          async read(file) {
            const filePath = file.url;
            // juggling the path around because the lib normalizes the ID,
            // i.e. `/strings/nanoid` is resolved to `c:/strings/nanoid` on windows
            // and passed as `file.url` to the function
            const schemaID = filePath.slice(path.parse(filePath).root.length);
            const schema = schemaMap.get(schemaID);

            if (!schema) {
              throw new Error(`No schema exists for ID "${schemaID}".`);
            }

            return schema;
          },
        },
      },
    },
  };

  for await (const [schemaPath, schema] of schemaMap) {
    console.log(JSON.stringify([schemaPath, schema.$id]));
    const schemaModule = createSchemaModule(schema);
    const schemaTypesModule = await createSchemaTypesModule(schema, options);
    const moduleInfos: IModuleInfo[] = [schemaModule, schemaTypesModule];

    moduleMap.set(schemaPath, moduleInfos);
  }

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

async function createSchemaTypesModule(
  schema: ISchema,
  options: Parameters<typeof compile>["2"],
) {
  const content = await compile(schema, "ISchema", options);

  const moduleExports: IModuleInfo["exports"] = [
    { name: "ISchema", type: "abstract" },
  ];

  const moduleInfo: IModuleInfo = {
    name: "types",
    content,
    exports: moduleExports,
  };

  return moduleInfo;
}

export default generateJSONSchemas;
