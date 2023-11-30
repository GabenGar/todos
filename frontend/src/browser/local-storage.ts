/**
 * @TODO key-based factory
 */
import { fromJSON, toJSON } from "#lib/json";

/**
 * All local store values are JSON-encoded strings.
 */
export const LOCAL_STORAGE_KEYS = {
  STORAGE_TEST: "__storage_test__",
  TODOS: "todos",
  PLACES: "places",
  LOG_LEVEL:"log_level"
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

/**
 * @link
 * [Using_the_Web_Storage_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage)
 */
export function isLocalStorageAvailable() {
  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.STORAGE_TEST,
      LOCAL_STORAGE_KEYS.STORAGE_TEST,
    );
    localStorage.removeItem(LOCAL_STORAGE_KEYS.STORAGE_TEST);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      localStorage?.length !== 0
    );
  }
}
