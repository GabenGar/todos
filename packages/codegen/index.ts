import path from "node:path";
import { ParseArgsConfig, parseArgs } from "node:util";
import { runCodegen } from "#codegen";

const options: ParseArgsConfig = {
  strict: true,
  allowPositionals: true,
};
const { positionals } = parseArgs(options);

if (positionals.length !== 2) {
  throw new Error(
    `Provided ${positionals.length} arguments while only 2 allowed.`,
  );
}

const inputFolder = positionals.at(0)?.trim();

if (!inputFolder) {
  throw new Error("No input folder was provided.");
}

const outputFolder = positionals.at(1)?.trim();

if (!outputFolder) {
  throw new Error("No output folder was provided.");
}

const resolvedInputFolder = path.resolve(inputFolder);
const resolvedOutputFolder = path.resolve(outputFolder);
await runCodegen(resolvedInputFolder, resolvedOutputFolder);
