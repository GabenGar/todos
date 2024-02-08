import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ITestModule, ITestModuleOutput } from "./types.js";

interface IOutputMap extends Map<string, ITestModuleOutput> {}

const inputFolderName = "input";
const outputFolderName = "output";
const expectedOutputFolderName = "expected-output";
const compiledGeneratorFilename = "generator.js";

export async function runTests(folderPath: string) {
	const generators = await collectGenerators(folderPath);
	const outputs = await runGenerators(generators);
}

async function collectGenerators(folderPath: string): Promise<Dirent[]> {
	console.log("Collecting generators...");

	const testsFolder = await fs.opendir(folderPath);
	const generatorEntries: Dirent[] = [];

	for await (const dirEntry of testsFolder) {
		if (!dirEntry.isDirectory()) {
			console.debug(`"${dirEntry.name}" is not a folder, skipping.`);
			continue;
		}

		generatorEntries.push(dirEntry);
	}

	return generatorEntries;
}

async function runGenerators(entries: Dirent[]): Promise<IOutputMap> {
	console.log(`Running ${entries.length} generators...`);

	const outputMap: IOutputMap = new Map();

	for await (const entry of entries) {
		const testModulePath = path.join(entry.path, entry.name);
		const generatorFilePath = pathToFileURL(
			path.join(testModulePath, compiledGeneratorFilename),
		).toString();
		const inputsFolderPath = path.join(testModulePath, inputFolderName);
		const inputEntries = await fs.readdir(inputsFolderPath, {
			encoding: "utf8",
			withFileTypes: true,
			recursive: true,
		});
		const testModule: ITestModule = await import(generatorFilePath);

		const outputs = await testModule.default(inputEntries);

		outputMap.set(testModulePath, outputs);
	}

	return outputMap;
}

async function saveOutputs(outputs: IOutputMap) {
	console.log(`Writing ${outputs.size} outputs...`);
	const flatMap = Array.from(outputs).reduce((flatMap) => {
		return flatMap;
	}, new Map<string, string>());

	for await (const [testModulePath, incomingOutputs] of outputs) {
		const outputFolderPath = path.join(testModulePath, outputFolderName);

		for await (const [relativeFilePath, content] of incomingOutputs) {
		}
	}
}

async function saveTestModuleOutputs() {}
