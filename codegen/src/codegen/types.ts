export type IGeneratedModule = IModuleInfo[] | IGeneratedNestedModule;

export interface IGeneratedNestedModule {
  type: "nested";
  /**
   * A name for the nested modules.
   */
  name: string;
  moduleMap: Map<IModuleInfo["name"], IModuleInfo>;
}

export interface IGeneratorModule {
  default: () => Promise<IGeneratedModule>;
}

export interface IGeneratorMap extends Map<string, ICodeGenerator> {}

export interface ICodeGenerator {
  name: string;
  generate: () => Promise<IGeneratedModule>;
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
