import { collectGenerators } from "./collect-generators.js";
import { generateCode } from "./generate-code.js";

export async function runCodegen(inputFolder: string, outputFolder: string) {
  console.log(
    `Running codegen at input folder "${inputFolder}" and output folder "${outputFolder}"...`,
  );
  const generators = await collectGenerators(inputFolder);
  await generateCode(outputFolder, generators);

  console.log(
    `Ran codegen at input folder "${inputFolder}" and output folder "${outputFolder}".`,
  );
}
