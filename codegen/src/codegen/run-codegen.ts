import { reduceFolder } from "#lib/fs";

export async function runCodegen(inputFolder: string, outputFolder: string) {
  const count = await reduceFolder(
    inputFolder,
    0,
    async (accum, entry, entrypath) => {
      console.log(
        `Codegen this 8::::::::::::::::D~~~~ at "${entrypath}" ${
          accum + 1
        } times.`
      );

      return accum + 1;
    }
  );
}
