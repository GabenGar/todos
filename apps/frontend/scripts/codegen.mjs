// @ts-check
import { runCodegen } from "@repo/nodejs/codegen";
import path from "node:path";
import { cwd } from "node:process";

const inputFolder = path.join(cwd(), "codegen", "generators");
const outputFolder = path.join(cwd(), "codegen", "generators");

run().catch((error) => console.error(error));

async function run() {
  await runCodegen(inputFolder, outputFolder);
}
