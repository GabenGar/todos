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
} from "#browser/store/indexed";
import { useClient } from "./client";

type IIndexedDBContext = IIDBTransactionRunner;

interface IIDBTransactionRunner<StoreName extends IStorageName = IStorageName> {
  (
    storeNames: StoreName | StoreName[] | Iterable<StoreName>,
    mode: Exclude<IDBTransactionMode, "versionchange">,
    onError: (event: Event) => void,
    run: (transaction: IIDBTransaction<StoreName>) => void,
  ): void;
}

const defaultContext: IIndexedDBContext = () => {};
const IndexedDBContext = createContext<IIndexedDBContext>(defaultContext);

export function IndexedDBProvider({ children }: { children: ReactNode }) {
  const { isClient } = useClient();
  const [database, changeDatabase] = useState<IDBDatabase>();

  const runIndexedDBTransaction = useCallback(
    <StoreName extends IStorageName>(
      storeNames: StoreName | StoreName[] | Iterable<StoreName>,
      mode: IDBTransactionMode,
      onError: (event: Event) => void,
      run: (transaction: IIDBTransaction<StoreName>) => void,
    ) => {
      if (isClient) {
        throw new Error("IndexedDB is only available on client.");
      }

      if (!database) {
        getDatabase(
          (error) => {
            throw error;
          },
          (db) => {
            changeDatabase(db);

            const transaction = getTransaction(db, storeNames, mode);

            transaction.onerror = onError;

            run(transaction);
          },
        );
      } else {
        const transaction = getTransaction(database, storeNames, mode);

        transaction.onerror = onError;

        run(transaction);
      }
    },
    [],
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
