import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { generateNestedCode } from "./generate-nested-code.js";
import { type IGeneratorMap, type IModuleInfo, codeMessage } from "./types.js";

export async function generateCode(
  outputFolder: string,
  generators: IGeneratorMap,
) {
  console.debug(`Generating code for ${generators.size} generators...`);

  console.debug("Creating a temporary folder...");

  // creating temp folder manually because `mkdtemp()`
  // cannot into recursive creation
  await mkdir(path.join(tmpdir(), "todos-codegen", "incoming"), {
    recursive: true,
  });
  const temporaryPath = await mkdtemp(
    path.join(tmpdir(), "todos-codegen", "incoming", path.sep),
  );

  console.debug(`Created the temporary folder "${temporaryPath}".`);

  const generatorCount = 1;
  for await (const [_, codeGenerator] of generators) {
    console.debug(
      `Generating code for generator "${codeGenerator.name}" (${generatorCount} out of ${generators.size})...`,
    );

    const { name: generatorName, generate } = codeGenerator;
    const generatorPath = path.join(temporaryPath, generatorName);
    const generatorModule = await generate();

    if (!Array.isArray(generatorModule)) {
      if (!("type" in generatorModule) || generatorModule.type !== "nested") {
        throw new Error(
          `Generator module at "${generatorPath}" is not a valid nested generator module.`,
        );
      }
      await generateNestedCode(generatorModule, generatorPath);
      continue;
    }

    await mkdir(generatorPath, { recursive: true });

    for await (const moduleInfo of generatorModule) {
      await saveModule(generatorPath, moduleInfo);
    }

    console.debug(`Generated code for generator "${codeGenerator.name}".`);
  }

  console.debug(
    `Replacing the contents of folder "${outputFolder}" with folder "${temporaryPath}"...`,
  );

  // creating temp folder manually because `mkdtemp()`
  // cannot into recursive creation
  await mkdir(path.join(tmpdir(), "todos-codegen", "backup"), {
    recursive: true,
  });
  const backupTempPath = await mkdtemp(
    path.join(tmpdir(), "todos-codegen", "backup", path.sep),
    {
      encoding: "utf8",
    },
  );
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
