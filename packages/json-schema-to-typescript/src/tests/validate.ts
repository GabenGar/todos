import { type Dirent, createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { expectedOutputFolderName, outputFolderName } from "./types.js";

export async function validateOutputs(folderPath: string) {
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
