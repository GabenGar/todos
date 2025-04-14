import {
  PAGINATION_LIMIT,
  createClientPagination,
  type IPaginatedCollection,
} from "#lib/pagination";
import { getTransaction } from "./transactions";
import type { IStorageName } from "./types";



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

          if (count === 0) {
            return reject(new Error(`No results found for store "${storeName}".`))
          }

          const pagination = createClientPagination(count, limit, page);
          // collecting all keys is kinda cringe
          // but better than getting all values
          // or iterating with cursor one-by-one
          const keysRequest = objectStore.getAllKeys();

          keysRequest.onsuccess = (event) => {
            const keys = (
              event.target as ReturnType<typeof objectStore.getAllKeys>
            ).result;
            const inputKeys = keys.slice(
              pagination.offset,
              pagination.offset + limit,
            );
            const keyRange = IDBKeyRange.bound(inputKeys[0], inputKeys.at(-1));
            const collectionRequest = objectStore.getAll(keyRange);

            collectionRequest.onsuccess = (event) => {
              const items = (event.target as typeof collectionRequest).result;

              resolve({ pagination, items });
            };
          };
        };
      });
    },
  );

  results.items.forEach((result) => validate(result));

  return results;
}
