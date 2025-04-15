export const databaseName = "public";
export const databaseVersion = 1;
export const storageNames = ["planned_events"] as const;

export type IStorageName = (typeof storageNames)[number];

export interface IIDBTransaction<StoreName extends IStorageName = IStorageName>
  extends IDBTransaction {
  objectStoreNames: IStoreNameStringList<StoreName>;
  objectStore(name: StoreName): IDBObjectStore;
}

interface IStoreNameStringList<StoreName extends IStorageName>
  extends DOMStringList {
  contains(string: string): string is StoreName;
  item(index: number): StoreName | null;
  [index: number]: StoreName;
  [Symbol.iterator](): ArrayIterator<StoreName>;
}

/**
 * Stolen from
 * https://stackoverflow.com/a/24501949
 */
export type IIDBBoolean = 0 | 1;

export function toIDBBoolean(value: boolean): IIDBBoolean {
  return value === true ? 1 : 0;
}

export function fromIDBBoolean(value: IIDBBoolean): boolean {
  return value === 1 ? true : false;
}

/**
 * Stolen from
 * https://stackoverflow.com/a/23809852
 */
export type IIDBNull = 0;

export function toIDBNull(value: undefined): IIDBNull {
  return 0;
}

export function fromIDBNull(value: IIDBNull): undefined {
  return undefined;
}
