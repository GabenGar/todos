// @ts-check

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

const localesPath = path.join(cwd(), "src", "_locales");

validate();

async function validate() {
  /**
   * @type {(import("node:fs").Dirent)[]}
   */
  let localesDir;

  try {
    localesDir = await readdir(localesPath, {
      encoding: "utf8",
      recursive: true,
      withFileTypes: true,
    });
  } catch (error) {
    // @ts-expect-error
    throw new Error(`Failed to read locales folder "${localesPath}".`, {
      cause: error,
    });
  }

  /**
   * @type {Map<string, Set<string>>}
   */
  const messageKeys = new Map();
  const localeFiles = localesDir.filter((dirEntry) => {
    return dirEntry.isFile();
  });

  for await (const dirEntry of localeFiles) {
    const locale = dirEntry.path;

    /**
     * @type {string}
     */
    let contents;

    try {
      const entryPath = path.join(dirEntry.path, dirEntry.name);
      contents = await readFile(entryPath, { encoding: "utf8" });
    } catch (error) {
      // @ts-expect-error
      throw new Error(`Failed to read locale file "${dirEntry.path}".`, {
        cause: error,
      });
    }

    /**
     * @type {Record<string, never>}
     */
    const messageData = JSON.parse(contents);

    const messages = Object.keys(messageData);

    messageKeys.set(locale, new Set(messages));
  }

  const counts = new Set(
    [...messageKeys.values()].map((messages) => messages.size)
  );

  if (counts.size !== 1) {
    throw new Error("Not all languages are equally supported.");
  }
}
