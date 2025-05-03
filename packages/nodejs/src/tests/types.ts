import type { Dirent } from "node:fs";

export interface ITestModuleGenerator {
  (inputs: Dirent[]): Promise<ITestModuleOutput>;
}

export interface ITestModule {
  default: ITestModuleGenerator;
}

/**
 * A map of relative file paths and their contents.
 */
export interface ITestModuleOutput extends Map<string, string> {}

export const inputFolderName = "input";
export const outputFolderName = "output";
export const expectedOutputFolderName = "expected-output";
export const compiledGeneratorFilename = "generator.js";
