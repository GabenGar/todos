import { IGeneratorMap } from "./types.js";

export async function generateCode(outputFolder: string, generators: IGeneratorMap) {
  for await (const [_, codeGenerator] of generators) {}
}
