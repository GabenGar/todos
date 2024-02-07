import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ITestModule } from "./types.js";

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

async function runGenerators(entries: Dirent[]) {
	console.log(`Running ${entries.length} generators...`);

	for await (const entry of entries) {
		const generatorPath = path.join(
			entry.path,
			entry.name,
			compiledGeneratorFilename,
		);
		const inputPath = path.join(entry.path, entry.name, inputFolderName);
		const inputEntries = await fs.readdir(inputPath, {
			encoding: "utf8",
			withFileTypes: true,
			recursive: true,
		});
		const testModule: ITestModule = await import(
			pathToFileURL(generatorPath).toString()
		);
	}
}
