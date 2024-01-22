import { toJSON } from "#lib/json";
import type { ILocalStoreKey } from "./types";

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
