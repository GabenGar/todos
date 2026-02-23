// @ts-check

import path from "node:path";
import { cwd } from "node:process";
import { runCodegen } from "@repo/nodejs/codegen";

const inputFolder = path.join(cwd(), "codegen", "generators");
const outputFolder = path.join(cwd(), "codegen", "output");

run().catch((error) => console.error(error));

async function run() {
  await runCodegen(inputFolder, outputFolder);
}
