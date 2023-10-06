/**
 * @TODO key-based factory
 */
import { fromJSON, toJSON } from "#lib/json";

/**
 * All local store values are JSON-encoded strings.
 */
export const LOCAL_STORAGE_KEYS = {
  TODOS: "todos",
  PLACES: "places",
} as const;

export type ILocalStoreKey =
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];

export function getLocalStoreItem<Type = unknown>(
  storeName: ILocalStoreKey,
): Type | undefined;
export function getLocalStoreItem<Type = unknown>(
  storeName: ILocalStoreKey,
  defaultValue: Type,
): Type;
export function getLocalStoreItem<Type = unknown>(
  storeName: ILocalStoreKey,
  defaultValue?: Type,
): Type | undefined {
  const storageItem = localStorage.getItem(storeName);

  if (storageItem === null) {
    if (defaultValue) {
      setLocalStoreItem<Type>(storeName, defaultValue);
    }

    return defaultValue;
  }

  const item = fromJSON<Type>(storageItem);

  if (!item) {
    if (defaultValue) {
      setLocalStoreItem<Type>(storeName, defaultValue);
    }

    return defaultValue;
  }

  return item;
}

export function setLocalStoreItem<Type = unknown>(
  storeName: ILocalStoreKey,
  value: Type,
) {
  try {
    const jsonValue = toJSON(value);
    localStorage.setItem(storeName, jsonValue);
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }

    throw new Error(`Failed to set item "${storeName}" in \`localStorage\`.`, {
      cause: error,
    });
  }
}

export function deleteLocaleStoreItem(storeName: ILocalStoreKey) {
  localStorage.removeItem(storeName);
}
