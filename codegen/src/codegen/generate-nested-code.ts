import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  type IGeneratedNestedModule,
  IModuleInfo,
  codeMessage,
} from "./types.js";

export async function generateNestedCode(
  generatorModule: IGeneratedNestedModule,
  generatorPath: string,
) {
  const { name, moduleMap } = generatorModule;
  const moduleName = typeof name === "string" ? [name] : name;
  let moduleCount = 1;

  console.debug(
    `Generating ${moduleMap.size} modules for the nested module "${path.join(
      ...moduleName,
    )}" at "${generatorPath}"...`,
  );

  for await (const [_, moduleInfos] of moduleMap) {
    const moduleFolderPath = path.join(generatorPath, ...moduleName);

    await mkdir(moduleFolderPath, { recursive: true });

    for await (const moduleInfo of moduleInfos) {
      const formattedModuleCount = moduleCount
        .toString()
        .padStart(moduleMap.size.toString().length, "0");

      await generateModule(moduleInfo, moduleFolderPath);

      console.debug(
        `Generated code for the module "${moduleInfo.name}" (${formattedModuleCount} out of ${moduleMap.size}).`,
      );
      moduleCount++;
    }
  }

  console.debug(`Generated nested module "${name}" at "${generatorPath}".`);
}

async function generateModule(moduleInfo: IModuleInfo, folderPath: string) {
  const { name, content, exports } = moduleInfo;
  const moduleFilePath = path.join(folderPath, `${name}.ts`);
  const fileContent = [codeMessage, content].join("\n");

  await writeFile(moduleFilePath, fileContent, { encoding: "utf8" });
}
