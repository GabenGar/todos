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
