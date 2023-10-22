export interface IGeneratorModule {
  default: () => Promise<string>;
}

export type ICodegenModule = { module: string } | { modules: string[] };

interface IModule {
  name: string;
}
