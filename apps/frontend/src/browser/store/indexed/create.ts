import { getOne } from "./get";
import { getTransaction } from "./get-transaction";

// interesting note for multi-inserts:
// https://stackoverflow.com/a/52555073/14481500

export async function createOneIndexedDBItem<InitType, Type>(
  storeName: string,
  init: InitType,
  validate: (input: unknown) => asserts input is Type,
): Promise<Type> {
  const newKey = await new Promise<IDBValidKey>((resolve) => {
    getTransaction([storeName], "readwrite").then((transaction) => {
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.add(init);
      request.onsuccess = (event) => {
        const newKey = (event.target as typeof request).result;

        resolve(newKey);
      };
    });
  });

  const newItem = await getOne(storeName, newKey, validate);

  return newItem;
}
