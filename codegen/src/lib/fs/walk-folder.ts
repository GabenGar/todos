import type { Dirent, PathLike } from "node:fs";
import { opendir } from "node:fs/promises";
import path from "node:path";

/**
 * @TODO non-recursive walk
 */
export async function walkFolder(
  folderPath: PathLike,
  callback: (entry: Dirent, folderPath: string) => Promise<void>,
) {
  console.debug(`Walking folder "${folderPath}"...`);

  await walk(folderPath, callback);

  console.debug(`Walked folder "${folderPath}".`);
}

async function walk(
  folderPath: PathLike,
  callback: (entry: Dirent, folderPath: string) => Promise<void>,
) {
  const folder = await opendir(folderPath, { encoding: "utf8" });

  for await (const entry of folder) {
    if (!entry.isDirectory()) {
      continue;
    }

    const nextFolderPath = path.join(folder.path, entry.name);
    await callback(entry, nextFolderPath);
    await walk(nextFolderPath, callback);
  }
}
