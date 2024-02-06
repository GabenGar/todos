// @ts-check
import fs from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

/**
 * @typedef {Record<typeof folderNames[number], import("node:fs").Dirent>} ITestModule
 */

const folderNames = /** @type {const} */ ([
  "input",
  "output",
  "expected-output",
]);
const testsFolderPath = path.join(cwd(), "tests", "static");
const testsFolder = await fs.opendir(testsFolderPath);

for await (const dirEntry of testsFolder) {
  if (dirEntry.isDirectory()) {
    console.log(`"${dirEntry.name}" is not a folder, skipping.`);
  }

  console.log(`Running test "${dirEntry.name}"...`);

  const testModule = await parseTestModule(dirEntry);
}

/**
 * @param {import("node:fs").Dirent} entry
 */
async function parseTestModule(entry) {
  const testFolderPath = path.join(entry.path, entry.name);
  const testFolderEntries = await fs.readdir(testFolderPath, {
    encoding: "utf8",
    withFileTypes: true,
  });

  if (testFolderEntries.length !== 3) {
    throw new Error(`"${entry.name}" is invalid.`);
  }

  const testModule = testFolderEntries.reduce((testModule, direEntry) => {

    return testModule;
  }, /** @type {ITestModule} */ ({}));
}
