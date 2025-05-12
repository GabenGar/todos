import path from "node:path";
import { cwd } from "node:process";
import { validateOutputs } from "#tests";

const testsFolderPath = path.join(cwd(), "tests", "static");

await validateOutputs(testsFolderPath);
