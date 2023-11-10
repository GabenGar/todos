import type { IGeneratedNestedModule, IModuleInfo } from "../../../../../codegen/src/codegen/types.js";

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

export default generateJSONSchemas;
