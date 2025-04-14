import type { IIDBTransaction, IStorageName } from "./types";

export function getTransaction<StoreName extends IStorageName>(
  db: IDBDatabase,
  storeNames: StoreName | StoreName[] | Iterable<StoreName>,
  mode?: IDBTransactionMode,
  options?: IDBTransactionOptions,
): IIDBTransaction<StoreName> {
  const transaction = db.transaction(storeNames, mode, options);

  return transaction as IIDBTransaction<StoreName>;
}
