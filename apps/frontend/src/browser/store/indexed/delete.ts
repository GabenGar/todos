import { getOneIndexedDBItem } from "./one";
import { getTransaction } from "./transactions";
import type { IStorageName } from "./types";

export async function deleteOneIndexedDBItem<Type>(
  storeName: IStorageName,
  id: string | number,
  validateOutput: (input: unknown) => asserts input is Type,
): Promise<Type> {
  const deletedItem = await getOneIndexedDBItem(storeName, id, validateOutput);

  await new Promise<void>((resolve, reject) => {
    getTransaction([storeName], "readwrite").then((transaction) => {
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.delete(id);

      request.onsuccess = (event) => {
        resolve();
      };

      request.onerror = (event) => {
        reject(event);
      };
    });
  });

  return deletedItem;
}
