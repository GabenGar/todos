import { IFunction } from "#types";

let isMigrated = false;

export function createLocalStorageFunction(func: IFunction) {
  function storageFunction(
    ...args: Parameters<typeof func>
  ): ReturnType<typeof func> {}

  return storageFunction;
}
