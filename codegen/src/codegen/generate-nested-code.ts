import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  type IGeneratedNestedModule,
  type IModuleInfo,
  codeMessage,
  indexFileName,
} from "./types.js";

export async function generateNestedCode(
  generatorModule: IGeneratedNestedModule,
  generatorPath: string,
) {
  const { name, moduleMap } = generatorModule;
  let moduleCount = 1;

  console.debug(
    `Generating ${moduleMap.size} modules for the nested module "${name}" at "${generatorPath}"...`,
  );

  for await (const [moduleName, moduleInfos] of moduleMap) {
    const moduleFolderPath = path.join(generatorPath, moduleName);
    const indexModules = new Map<string, IModuleInfo["exports"]>();

    await mkdir(moduleFolderPath, { recursive: true });

    for await (const moduleInfo of moduleInfos) {
      const formattedModuleCount = moduleCount
        .toString()
        .padStart(moduleMap.size.toString().length, "0");

      await generateModule(moduleInfo, moduleFolderPath);
      indexModules.set(moduleInfo.name, moduleInfo.exports);

      console.debug(
        `Generated code for the module "${moduleInfo.name}" (${formattedModuleCount} out of ${moduleMap.size}).`,
      );
      moduleCount++;
    }

    await saveIndexFile(moduleFolderPath, indexModules);
  }

  console.debug(`Generated nested module "${name}" at "${generatorPath}".`);
}

async function generateModule(moduleInfo: IModuleInfo, folderPath: string) {
  const { name, content } = moduleInfo;
  const moduleFilePath = path.join(folderPath, `${name}.ts`);
  const fileContent = [codeMessage, content].join("\n");

  await writeFile(moduleFilePath, fileContent, { encoding: "utf8" });
}

async function saveIndexFile(
  modulePath: string,
  indexModules: Map<string, IModuleInfo["exports"]>,
) {
  console.debug(`Generating index file for module "${modulePath}"...`);

  const indexFilePath = path.join(modulePath, indexFileName);
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

      const exportStatement = `export {${symbolExports}} from "./${moduleName}"`;

      lines.push(exportStatement);

      return lines;
    }, [])
    .join("\n");

  await writeFile(indexFilePath, indexContent, { encoding: "utf8" });

  console.debug(`Generated index file for module "${modulePath}".`);
}
