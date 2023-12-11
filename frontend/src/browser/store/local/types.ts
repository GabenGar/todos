/**
 * All local store values are JSON-encoded strings.
 */
export const LOCAL_STORAGE_KEYS = {
  STORAGE_TEST: "__storage_test__",
  TODOS: "todos",
  PLACES: "places",
  LOG_LEVEL: "log_level",
} as const;

export type ILocalStoreKey = Exclude<
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS],
  typeof LOCAL_STORAGE_KEYS.STORAGE_TEST
>;
