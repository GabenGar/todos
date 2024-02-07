import path from "node:path";
import { cwd } from "node:process";
import { runTests } from "#tests";

const testsFolderPath = path.join(cwd(), "tests", "static");

await runTests
