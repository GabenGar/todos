export { getDatabase } from "./get-database";
export { getTransaction } from "./transactions";
export { isIndexedDBAvailable } from "./is-available";
export { toIDBBoolean, fromIDBBoolean, toIDBNull, fromIDBNull } from "./types";
export type {
  IStorageName,
  IIDBTransaction,
  IIDBBoolean,
  IIDBNull,
  IIDBArgs,
} from "./types";
