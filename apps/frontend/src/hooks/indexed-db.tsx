import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  getDatabase,
  getTransaction,
  type IIDBTransaction,
  type IStorageName,
} from "#store/indexed";
import { useClient } from "./client";

type IIndexedDBContext = IIDBTransactionRunner;

interface IIDBTransactionRunner<StoreName extends IStorageName = IStorageName> {
  (
    storeNames: StoreName | StoreName[] | Iterable<StoreName>,
    mode: Exclude<IDBTransactionMode, "versionchange">,
    onError: (error: Error | DOMException) => void,
    onSuccess: (transaction: IIDBTransaction<StoreName>) => void,
  ): void;
}

const defaultContext: IIndexedDBContext = () => {};
const IndexedDBContext = createContext<IIndexedDBContext>(defaultContext);

export function IndexedDBProvider({ children }: { children: ReactNode }) {
  const client = useClient();
  const [database, changeDatabase] = useState<IDBDatabase>();

  // @TODO: check for client without race conditions
  const runIndexedDBTransaction = useCallback(
    <StoreName extends IStorageName>(
      storeNames: StoreName | StoreName[] | Iterable<StoreName>,
      mode: IDBTransactionMode,
      onError: (error: Error | DOMException) => void,
      onSuccess: (transaction: IIDBTransaction<StoreName>) => void,
    ) => {
      if (!database) {
        getDatabase(
          (error) => {
            throw error;
          },
          (db) => {
            changeDatabase(db);

            const transaction = getTransaction(db, storeNames, mode);

            transaction.onerror = handleError;
            transaction.onabort = handleError;

            onSuccess(transaction);
          },
        );
      } else {
        const transaction = getTransaction(database, storeNames, mode);

        transaction.onerror = handleError;
        transaction.onabort = handleError;

        onSuccess(transaction);
      }

      function handleError(event: Event) {
        const error = (event.target as IIDBTransaction<StoreName>).error!;
        onError(error);
      }
    },
    [database, client],
  );

  return (
    <IndexedDBContext.Provider value={runIndexedDBTransaction}>
      {children}
    </IndexedDBContext.Provider>
  );
}

export function useIndexedDB() {
  const context = useContext(IndexedDBContext);

  return context;
}
