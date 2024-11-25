import { getTransaction } from "./get-transaction";
import type { IStorageName } from "./types";

export async function countIndexedDBItems(
  storeName: IStorageName,
): Promise<number> {
  const resultCount = await new Promise<number>((resolve, reject) => {
    getTransaction([storeName], "readonly").then((transaction) => {
      transaction.onerror = (event) => {
        reject(event);
      };

      const objectStore = transaction.objectStore(storeName);
      const countRequest = objectStore.count();

      countRequest.onsuccess = (event) => {
        const count = (event.target as typeof countRequest).result;

        resolve(count);
      }
    });
  });

  return resultCount
}
