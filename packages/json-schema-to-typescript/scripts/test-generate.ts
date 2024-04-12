import path from "node:path";
import { cwd, exit } from "node:process";
import { generateTests } from "#tests";

const testsFolderPath = path.join(cwd(), "tests", "static");

await generateTests(testsFolderPath).catch((error) => {
	console.error(error);
	exit(1);
});
