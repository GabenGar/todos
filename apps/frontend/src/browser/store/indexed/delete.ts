import { getOneIndexedDBItem } from "./get";
import { getTransaction } from "./get-transaction";
import type { IStorageName } from "./types";

export async function deleteOneIndexedDBItem<Type>(
  storeName: IStorageName,
  id: string | number,
  validateOutput: (input: unknown) => asserts input is Type,
): Promise<Type> {
  const deletedItem = await getOneIndexedDBItem(storeName, id, validateOutput);

  await new Promise<IDBValidKey>((resolve, reject) => {
    getTransaction([storeName], "readwrite").then((transaction) => {
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.get(id);

      request.onsuccess = (event) => {
        const updatedKey = (event.target as typeof request).result;

        resolve(updatedKey);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  });

  return deletedItem;
}
