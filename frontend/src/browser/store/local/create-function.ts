import type { IFunction } from "#types";
import { runMigrations } from "./migrations";

let isMigrated = false;

export function createLocalStorageFunction(func: IFunction): typeof func {
  async function storageFunction(
    ...args: Parameters<typeof func>
  ): Promise<ReturnType<typeof func>> {
    if (!isMigrated) {
      await runMigrations();
      isMigrated = true;
    }

    return await func(...args);
  }

  return storageFunction;
}
