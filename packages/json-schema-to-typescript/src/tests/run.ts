import { cwd } from "node:process";
import { type Dirent, createReadStream } from "node:fs";
import fs, { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ITestModule, ITestModuleOutput } from "./types.js";
import { execFile as oldExecFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash } from "node:crypto";

const execFile = promisify(oldExecFile);

interface IOutputMap extends Map<string, ITestModuleOutput> {}

const inputFolderName = "input";
const outputFolderName = "output";
const expectedOutputFolderName = "expected-output";
const compiledGeneratorFilename = "generator.js";

export async function runTests(folderPath: string) {
	const generators = await collectGenerators(folderPath);
	const outputs = await runGenerators(generators);
	await saveOutputs(outputs);
	await formatTests(folderPath);
	await validateOutputs(folderPath);
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

	/**
	 * A mapping of file paths and their contents.
	 */
	const outputMap = Array.from(outputs).reduce(
		(outputMap, [modulePath, moduleOutput]) => {
			for (const [fileName, content] of moduleOutput) {
				const filePath = path.join(modulePath, outputFolderName, fileName);

				if (!outputMap.has(filePath)) {
					throw new Error(`Output for path "${filePath}" already exists.`);
				}

				outputMap.set(filePath, content);
			}

			return outputMap;
		},
		new Map<string, string>(),
	);

	for await (const [filePath, content] of outputMap) {
		await writeFile(filePath, content, { encoding: "utf8" });
	}
}

async function formatTests(folderPath: string) {
	console.log("Formatting tests...");

	const inputFolder = path.relative(cwd(), folderPath);

	const result = await execFile("biome", ["check", inputFolder, "--apply"]);

	return result;
}

async function validateOutputs(folderPath: string) {
	console.log("Validatings test outputs...");

	const testsFolder = await fs.opendir(folderPath);

	for await (const dirEntry of testsFolder) {
		if (!dirEntry.isDirectory()) {
			console.debug(`"${dirEntry.name}" is not a folder, skipping.`);
			continue;
		}

		await compareOutputs(dirEntry);
	}
}

async function compareOutputs(testEntry: Dirent) {
	const testEntryPath = path.join(testEntry.path, testEntry.name);
	const expectedOutputFolderPath = path.join(
		testEntryPath,
		expectedOutputFolderName,
	);

	const expectedOutputFolder = await fs.opendir(expectedOutputFolderPath, {
		encoding: "utf8",
		recursive: true,
	});

	for await (const entry of expectedOutputFolder) {
		if (entry.isDirectory()) {
			continue;
		}

		const entryPath = path.join(entry.path, entry.name);
		const relativepath = path.relative(expectedOutputFolderPath, entryPath);
		const outputPath = path.join(testEntryPath, outputFolderName, relativepath);
		const expectedHash = await getFileSHA256Hash(entryPath);
		const outputHash = await getFileSHA256Hash(outputPath);

		if (expectedHash !== outputHash) {
			throw new Error(
				`Contents of "${entryPath}" and "${outputPath}" do not match.`,
			);
		}
	}
}

async function getFileSHA256Hash(filePath: string): Promise<string> {
	const hashValue = new Promise<string>((resolve, reject) => {
		const fileStream = createReadStream(filePath);
		const hash = createHash("sha256");

		fileStream.on("data", (chunk) => {
			hash.update(chunk);
		});

		fileStream.on("error", (error) => {
			reject(error);
		});

		fileStream.on("end", () => {
			const value = hash.digest("hex");

			resolve(value);
		});
	});

	return hashValue;
}
