import path from "node:path";
import type {
  IGeneratedNestedModule,
  IModuleInfo,
} from "../../../../../codegen/src/codegen/types.js";
// @TODO import from a core lib once it's implemented
import { reduceFolder } from "../../../../../codegen/src/lib/fs/index.js";

const schemaFolderPath = path.resolve("../../../../../schema");
/**
 * The key is the path to the schema file relative to
 */
interface ISchemaMap extends Map<string, { $id: string }> {}


async function generateJSONSchemas(): Promise<IGeneratedNestedModule> {
  const content = `export const ROCKET_SHIP = ""`;
  const moduleData: IModuleInfo = {
    name: "schema",
    content,
    exports: [{ name: "ROCKET_SHIP", type: "concrete" }],
  };
  const modulesData = [moduleData];

  return modulesData;
}

async function getSchemas(): Promise<ISchemaMap> {
  const schemaMap = new Map();

  return schemaMap;
}

export default generateJSONSchemas;
