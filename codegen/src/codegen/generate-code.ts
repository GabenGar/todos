import path from "node:path";
import type { IGeneratorMap, IModuleInfo } from "./types.js";

export async function generateCode(
  outputFolder: string,
  generators: IGeneratorMap,
) {
  console.debug(`Generating code for ${generators.size} generators...`);

  for await (const [_, codeGenerator] of generators) {
    console.debug(`Generating code for generator "${codeGenerator.name}"...`);

    const { name: generatorName, generate } = codeGenerator;
    const generatorPath = path.join(outputFolder, generatorName);
    const modulesInfo = await generate();

    for await (const moduleInfo of modulesInfo) {
    }

    console.debug(`Generated code for generator "${codeGenerator.name}".`);
  }

  console.debug(`Generated code for ${generators.size} generators.`);
}

async function saveModule(
  generatorPath: string,
  { name, content, exports }: IModuleInfo,
) {
  console.debug(`Generating code for the module "${name}"...`);

  const modulePath = path.join(generatorPath, `${name}.ts`);

  console.debug(`Generated code for the module "${name}".`);
}
