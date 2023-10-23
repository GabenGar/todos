import { reduceFolder } from "#lib/fs";

export async function runCodegen(inputFolder: string, outputFolder: string) {
  console.log(
    `Codegen this 8::::::::::::::::D~~~~ at input folder "${inputFolder}".`,
  );

  const count = await reduceFolder(
    inputFolder,
    0,
    async (accum, entry, entrypath) => {
      return accum + 1;
    },
  );

  console.log(
    `Codegen this 8::::::::::::::::D~~~~ at output folder "${outputFolder}" ${count} times.`,
  );
}
