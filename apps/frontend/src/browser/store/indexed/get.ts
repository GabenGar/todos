import {
  PAGINATION_LIMIT,
  createClientPagination,
  type IPaginatedCollection,
} from "#lib/pagination";
import { getTransaction } from "./get-transaction";
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

export async function getManyIndexedDBItems<Type>(
  storeName: IStorageName,
  validate: (input: unknown) => asserts input is Type,
  page?: number,
  limit: number = PAGINATION_LIMIT,
): Promise<IPaginatedCollection<Type>> {
  const results = await new Promise<IPaginatedCollection<Type>>(
    (resolve, reject) => {
      getTransaction([storeName], "readonly").then((transaction) => {
        transaction.onerror = (event) => {
          reject(event);
        };

        const objectStore = transaction.objectStore(storeName);
        const countRequest = objectStore.count();

        countRequest.onsuccess = (event) => {
          const count = (event.target as typeof countRequest).result;
          const pagination = createClientPagination(count, limit, page);
          const keysRequest = (objectStore.getAllKeys(
            undefined,
            limit,
          ).onsuccess = (event) => {
            const keys = (
              event.target as ReturnType<typeof objectStore.getAllKeys>
            ).result;
            const keyRange = IDBKeyRange
          });
          const collectionRequest = objectStore.getAll(keyRangeValue, limit);

          collectionRequest.onsuccess = (event) => {
            const items = (event.target as typeof collectionRequest).result;

            resolve({ pagination, items });
          };
        };
      });
    },
  );

  results.items.forEach((result) => validate(result));

  return results;
}
