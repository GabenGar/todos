import { mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { generateNestedCode } from "./generate-nested-code.js";
import {
  type IGeneratorMap,
  type IModuleInfo,
  codeMessage,
  indexFileName,
} from "./types.js";

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

    const indexModules = new Map<string, IModuleInfo["exports"]>();
    await mkdir(generatorPath, { recursive: true });

    for await (const moduleInfo of generatorModule) {
      await saveModule(generatorPath, moduleInfo);
      indexModules.set(moduleInfo.name, moduleInfo.exports);
    }

    await saveIndexFile(generatorPath, indexModules);

    console.debug(`Generated code for generator "${codeGenerator.name}".`);
  }

  console.debug(
    `Replacing the contents of folder "${outputFolder}" with folder "${temporaryPath}"...`,
  );

  // not doing transactional replacement because
  // windows is upset over folder renames
  await rm(outputFolder, { recursive: true, maxRetries: 5, retryDelay: 500 });
  await rename(temporaryPath, outputFolder);

  console.debug(`Replaced the contents of folder "${outputFolder}".`);

  console.debug(`Generated code for ${generators.size} generators.`);
}

async function saveModule(
  generatorPath: string,
  { name, content }: IModuleInfo,
) {
  console.debug(`Generating code for the module "${name}"...`);

  const modulePath = path.join(generatorPath, `${name}.ts`);
  const fileContent = [codeMessage, content].join("\n");

  // generator folder is created ahead of time
  // so there is no need for ensuring folder existence
  await writeFile(modulePath, fileContent, { encoding: "utf8" });

  console.debug(`Generated code for the module "${name}".`);
}

async function saveIndexFile(
  generatorPath: string,
  indexModules: Map<string, IModuleInfo["exports"]>,
) {
  console.debug(`Generating index file for generator "${generatorPath}"...`);

  const indexFilePath = path.join(generatorPath, indexFileName);
  const indexContent = Array.from(indexModules)
    .reduce<string[]>((lines, [moduleName, moduleExports]) => {
      if (!moduleExports.length) {
        throw new Error(
          `Generated code must export at least one symbol and the module "${moduleName}" exported none.`,
        );
      }

      const symbolExports = moduleExports
        .map<string>(({ name, type, alias }) => {
          const symbolString = `${type === "abstract" ? `type ${name}` : name}${
            alias ? ` as ${alias}` : ""
          }`;

          return symbolString;
        })
        .join(", ");

      const exportStatement = `export {${symbolExports}} from "./${moduleName}.js"`;

      lines.push(exportStatement);

      return lines;
    }, [])
    .join("\n");

  await writeFile(indexFilePath, indexContent, { encoding: "utf8" });

  console.debug(`Generated index file for generator "${generatorPath}".`);
}
