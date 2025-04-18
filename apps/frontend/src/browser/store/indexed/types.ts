export interface IIDBSchema {
  public: {
    planned_events: ["recently_created", "recently_updated"];
  };
}
export const databaseName = "public";
export const databaseVersion = 2;
export const storageNames = [
  "planned_events",
] as const satisfies (keyof IIDBSchema["public"])[];

export type IStorageName = (typeof storageNames)[number];

export interface IIDBTransaction<StoreName extends IStorageName = IStorageName>
  extends Omit<IDBTransaction, "objectStore"> {
  objectStoreNames: IStoreNameStringList<StoreName>;
  objectStore(name: StoreName): IIDBObjectStore<StoreName>;
}

interface IIDBObjectStore<StoreName extends IStorageName = IStorageName>
  extends Omit<
    IDBObjectStore,
    "createIndex" | "deleteIndex" | "index" | "transaction"
  > {
  transaction: IIDBTransaction<StoreName>;
  createIndex(
    name: IIDBSchema["public"][StoreName][number],
    keyPath: string | string[],
    options?: IDBIndexParameters,
  ): IDBIndex;
  deleteIndex(name: IIDBSchema["public"][StoreName][number]): void;
  index(name: IIDBSchema["public"][StoreName][number]): IDBIndex;
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
