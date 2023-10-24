import path from "node:path";
import { reduceFolder } from "#lib/fs";
import {
  type ICodeGenerator,
  type IGeneratorMap,
  type IGeneratorModule,
  generatorName,
} from "./types.js";

export async function collectGenerators(
  inputFolder: string,
): Promise<IGeneratorMap> {
  console.debug(`Collecting generators from "${inputFolder}"...`);

  const generators = await reduceFolder(
    inputFolder,
    new Map(),
    async (generators, entry, entrypath) => {
      if (entry.isFile() && entry.name === generatorName) {
        const modulePath = String(entrypath);
        const generatorModule: object = await import(modulePath);

        validateGeneratorModule(generatorModule, modulePath);

        const generatorName = path.relative(inputFolder, modulePath);
        const codegenGenerator: ICodeGenerator = {
          name: generatorName,
          generate: generatorModule.default,
        };

        generators.set(generatorName, codegenGenerator);
      }

      return generators;
    },
  );

  console.debug(
    `Collected ${generators.size} generators from "${inputFolder}".`,
  );

  return generators;
}

function validateGeneratorModule(
  inputModule: object,
  modulePath: string,
): asserts inputModule is IGeneratorModule {
  const exportsAmount = Object.keys(module).length;

  if (exportsAmount !== 1) {
    throw new Error(
      `Generator modules must have 1 export, but the module "${modulePath}" has ${exportsAmount}.`,
    );
  }

  if (!("default" in module)) {
    throw new Error(
      `Generator module "${modulePath}" does not have a default export.`,
    );
  }

  if (typeof module.default !== "function") {
    throw new Error(
      `Default export of generator module "${modulePath}" is not a function.`,
    );
  }
}
