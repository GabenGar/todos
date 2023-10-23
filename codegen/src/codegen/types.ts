export interface IGeneratorModule {
  default: () => Promise<string>;
}

export interface IGeneratorMap extends Map<string, ICodeGenerator> {}

export interface ICodeGenerator {
  name: string;
  generate: () => Promise<string>;
}

export const generatorName = "generator.js";
