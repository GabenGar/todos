import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdtemp } from "node:fs/promises";
import { runCodegen } from "#codegen";

const inputFolder = path.dirname(fileURLToPath(import.meta.url));
const outputFolder = await mkdtemp(".tmp/codegen");
await runCodegen(inputFolder, outputFolder);
