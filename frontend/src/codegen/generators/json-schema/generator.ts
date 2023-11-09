import type { IModuleInfo } from "../../../../../codegen/src/codegen/types.js";

async function generateRocketShip(): Promise<IModuleInfo[]> {
  const content = `export const ROCKET_SHIP = "8::::::::::::::::D~~~~"`;
  const moduleData: IModuleInfo = {
    name: "schema",
    content,
    exports: [{ name: "ROCKET_SHIP", type: "concrete" }],
  };
  const modulesData = [moduleData];

  return modulesData;
}

export default generateRocketShip;
