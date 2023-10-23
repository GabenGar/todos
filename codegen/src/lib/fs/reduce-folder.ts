import type { Dirent, PathLike } from "node:fs";
import { opendir } from "node:fs/promises";
import path from "node:path";
import { walkFolder } from "./walk-folder.js";

export async function reduceFolder<AccumulatorType>(
  folderPath: PathLike,
  initValue: AccumulatorType,
  reducer: (
    accumulator: AccumulatorType,
    entry: Dirent,
    entryPath: PathLike,
  ) => Promise<AccumulatorType>,
): Promise<AccumulatorType> {
  let accumulator = initValue;

  await walkFolder(folderPath, async (entry, folderPath) => {
    const folder = await opendir(folderPath);

    accumulator = await reducer(accumulator, entry, folderPath);

    for await (const subEntry of folder) {
      // skipping directories because they get iterated by `walkFolder()`
      if (subEntry.isDirectory()) {
        continue;
      }

      const entryPath = path.join(folder.path, subEntry.name);
      accumulator = await reducer(accumulator, subEntry, entryPath);
    }
  });

  return accumulator;
}
