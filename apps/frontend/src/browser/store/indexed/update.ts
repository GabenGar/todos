import { getOneIndexedDBItem } from "./get";
import { getTransaction } from "./get-transaction";
import type { IStorageName } from "./types";

export async function updateOneIndexedDBItem<UpdateType, Type>(
  storeName: IStorageName,
  update: UpdateType,
  validateOutput: (input: unknown) => asserts input is Type,
  id?: string | number,
): Promise<Type> {
  const newKey = await new Promise<IDBValidKey>((resolve, reject) => {
    getTransaction([storeName], "readwrite").then((transaction) => {
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.put(update, id);

      request.onsuccess = (event) => {
        const updatedKey = (event.target as typeof request).result;

        resolve(updatedKey);
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  });

  const newItem = await getOneIndexedDBItem(storeName, newKey, validateOutput);

  return newItem;
}
