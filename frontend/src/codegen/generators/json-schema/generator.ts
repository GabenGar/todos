/**
 * @TODO somehow import from codegen package without bending output sideways
 */

interface IModuleInfo {
  name: string;
  content: string;
  exports: IModuleExport[];
}

interface IModuleExport {
  type: "abstract" | "concrete";
  /**
   * An exported symbol name.
   */
  name: string;
  /**
   * An alias for the exported name, if any.
   */
  alias?: string;
}

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
