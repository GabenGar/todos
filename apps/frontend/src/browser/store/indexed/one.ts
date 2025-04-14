import { getTransaction } from "./transactions";
import type { IStorageName } from "./types";

export async function getOneIndexedDBItem<Type>(
  storeName: IStorageName,
  query: IDBValidKey,
  validate: (input: unknown) => asserts input is Type,
): Promise<Type> {
  const result = await new Promise((resolve, reject) => {
    getTransaction([storeName], "readonly").then((transaction) => {
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get(query);

      request.onerror = (event) => {
        reject(event);
      };

      request.onsuccess = (event) => {
        const result: unknown = (event.target as typeof request).result;

        resolve(result);
      };
    });
  });

  validate(result);

  return result;
}
