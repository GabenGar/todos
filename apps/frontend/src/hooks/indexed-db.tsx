import {
  createContext,
  useContext,
  useEffect,
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

type IIndexedDBContext = undefined | IIDBTransactionRunner;

interface IIDBTransactionRunner<StoreName extends IStorageName = IStorageName> {
  (
    storeNames: StoreName | StoreName[] | Iterable<StoreName>,
    mode: IDBTransactionMode,
    onError: (event: Event) => void,
    run: (transaction: IIDBTransaction<StoreName>) => void,
  ): void;
}

const defaultContext: IIndexedDBContext = undefined;
const IndexedDBContext = createContext<IIndexedDBContext>(defaultContext);

export function IndexedDBProvider({ children }: { children: ReactNode }) {
  const { isClient } = useClient();
  const [database, changeDatabase] = useState<IDBDatabase>();

  function runIndexedDBTransaction<StoreName extends IStorageName>(
    storeNames: StoreName | StoreName[] | Iterable<StoreName>,
    mode: IDBTransactionMode,
    onError: (event: Event) => void,
    run: (transaction: IIDBTransaction<StoreName>) => void,
  ) {
    const transaction = getTransaction(database!, storeNames, mode);

    transaction.onerror = onError;

    run(transaction);
  }

  useEffect(() => {
    getDatabase(
      (error) => {
        throw error;
      },
      (db) => {
        changeDatabase(db);
      },
    );

    return () => {
      database?.close();
    };
  }, []);

  return (
    <IndexedDBContext.Provider
      value={!isClient && !database ? undefined : runIndexedDBTransaction}
    >
      {children}
    </IndexedDBContext.Provider>
  );
}

export function useIndexedDB() {
  const context = useContext(IndexedDBContext);

  return context;
}
