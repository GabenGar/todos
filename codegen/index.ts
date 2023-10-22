import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCodegen } from "#codegen";

await runCodegen(path.dirname(fileURLToPath(import.meta.url)));
