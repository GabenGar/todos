import type { IEntityItem } from "#lib/entities";
import { runMigrations } from "./migrations";
import { getLocalStoreItem } from "./get";
import { setLocalStoreItem } from "./set";
import type { ILocalStoreKey } from "./types";

interface ILocalStorage<Type extends IEntityItem> {
  get: () => Promise<Type>;
  set: (value: Type) => Promise<void>;
}

let isMigrated = false;

export function createLocalStorage<Type extends IEntityItem>(
  storageName: ILocalStoreKey,
  defaultValue: Type,
  validate: (input: unknown) => asserts input is Type,
): ILocalStorage<Type> {
  const storage: ILocalStorage<Type> = {
    get: createLocalStorageFunction(async () => {
      const item = getLocalStoreItem(storageName, defaultValue);
      validate(item);

      return item;
    }),
    set: createLocalStorageFunction(async (value) => {
      validate(value);

      setLocalStoreItem(storageName, value);
    }),
  };

  return storage;
}

function createLocalStorageFunction<ArgsType extends any[], ReturnShape>(
  func: (...args: ArgsType) => Promise<ReturnShape>,
): typeof func {
  async function storageFunction(
    ...args: Parameters<typeof func>
  ): Promise<Awaited<ReturnType<typeof func>>> {
    if (!isMigrated) {
      await runMigrations();
      isMigrated = true;
    }

    return await func(...args);
  }

  return storageFunction;
}
