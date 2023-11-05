import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { IGeneratorMap, IModuleInfo } from "./types.js";

const codeMessage = [
  "/**",
  " * This module was generated automatically.",
  " * Do not edit it manually.",
  " */",
].join("\n");

export async function generateCode(
  outputFolder: string,
  generators: IGeneratorMap,
) {
  console.debug(`Generating code for ${generators.size} generators...`);

  console.debug("Creating a temporary folder...");
  const temporaryPath = await mkdtemp(path.join(tmpdir()));
  console.debug(`Created the temporary folder "${temporaryPath}".`);

  for await (const [_, codeGenerator] of generators) {
    console.debug(`Generating code for generator "${codeGenerator.name}"...`);

    const { name: generatorName, generate } = codeGenerator;
    const generatorPath = path.join(temporaryPath, generatorName);
    const modulesInfo = await generate();

    if (!Array.isArray(modulesInfo)) {
      throw new Error("Nested codegen is not implemented.")
    }

    await mkdir(generatorPath, { recursive: true });

    for await (const moduleInfo of modulesInfo) {
      await saveModule(generatorPath, moduleInfo);
    }

    console.debug(`Generated code for generator "${codeGenerator.name}".`);
  }

  console.debug(
    `Replacing the contents of folder "${outputFolder}" with folder "${temporaryPath}"...`,
  );

  const backupTempPath = await mkdtemp(path.join(tmpdir()), {
    encoding: "utf8",
  });
  const backupPath = path.join(backupTempPath, "backup");
  await rename(outputFolder, backupPath);
  await rename(temporaryPath, outputFolder);
  await rm(backupTempPath, { recursive: true });

  console.debug(`Replaced the contents of folder "${outputFolder}".`);

  console.debug(`Generated code for ${generators.size} generators.`);
}

async function saveModule(
  generatorPath: string,
  { name, content, exports }: IModuleInfo,
) {
  console.debug(`Generating code for the module "${name}"...`);

  const modulePath = path.join(generatorPath, `${name}.ts`);
  const fileContent = [codeMessage, content].join("\n");

  // generator folder is created ahead of time
  // so there is no need for ensuring folder existence
  await writeFile(modulePath, fileContent, { encoding: "utf8" });

  console.debug(`Generated code for the module "${name}".`);
}
