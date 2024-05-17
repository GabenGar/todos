import { getTransaction } from "./get-transaction";

export async function getOneIndexedDBItem<Type>(
  storeName: string,
  query: IDBValidKey,
  validate: (input: unknown) => asserts input is Type,
): Promise<Type> {
  const result = await new Promise((resolve) => {
    getTransaction([storeName], "readonly").then((transaction) => {
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get(query);

      request.onsuccess = (event) => {
        const result: unknown = (event.target as typeof request).result;

        resolve(result);
      };
    });
  });

  validate(result);

  return result;
}

/**
 * @TODO pagination
 */
export async function getManyIndexedDBItems<Type>(
  storeName: string,
  validate: (input: unknown) => asserts input is Type,
): Promise<Type[]> {
  const results = await new Promise<Type[]>((resolve) => {
    getTransaction([storeName], "readonly").then((transaction) => {
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const items = (event.target as typeof request).result;

        resolve(items);
      };
    });
  });

  results.forEach((result) => validate(result));

  return results;
}
