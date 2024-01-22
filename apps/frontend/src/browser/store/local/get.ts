import { fromJSON } from "#lib/json";
import { setLocalStoreItem } from "./set";
import type { ILocalStoreKey } from "./types";

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
