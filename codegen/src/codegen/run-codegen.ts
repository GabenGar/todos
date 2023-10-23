import { collectGenerators } from "./collect-generators.js";

export async function runCodegen(inputFolder: string, outputFolder: string) {
  console.log(
    `Running codegen at input folder "${inputFolder}" and output folder "${outputFolder}"...`,
  );

  const generators = await collectGenerators(inputFolder);

  console.log(
    `Ran codegen at input folder "${inputFolder}" and output folder "${outputFolder}".`,
  );
}
