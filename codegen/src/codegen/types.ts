export interface IGeneratorModule {
  default: () => Promise<IModuleInfo[]>;
}

export interface IGeneratorMap extends Map<string, ICodeGenerator> {}

export interface ICodeGenerator {
  name: string;
  generate: () => Promise<IModuleInfo[]>;
}

export interface IModuleInfo {
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

export const generatorName = "generator.js";
