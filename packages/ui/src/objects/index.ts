import type { IDictionary, IMaybe } from "#types";

export function isObject(input: unknown): input is object {
  return typeof input === "object" && input !== null;
}

export function collectUnknownObjectKeys(
  input: object,
  knownKeys?: Set<string>,
): IMaybe<IDictionary> {
  const unknownKeys: IDictionary = new Map();

  for (const [key, value] of Object.entries(input)) {
    if (knownKeys?.has(key)) {
      continue;
    }

    unknownKeys.set(key, value);
  }

  return unknownKeys.size === 0 ? undefined : unknownKeys;
}
