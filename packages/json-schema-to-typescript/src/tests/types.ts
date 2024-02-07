import type { Dirent } from "node:fs";

export interface ITestModule {
	default: (inputs: Dirent[]) => Promise<ITestModuleOutput>;
}

/**
 * A map of relative file paths and their contents.
 */
export interface ITestModuleOutput extends Map<string, string> {}
