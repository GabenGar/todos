const databaseName = "__test__";
const databaseVersion = 1;

export async function isIndexedDBAvailable(): Promise<boolean> {
  const isAvailable = await new Promise<boolean>((resolve, reject) => {
    const idbRequest = indexedDB.open(databaseName, databaseVersion);

    idbRequest.onerror = (event) => {
      const error =
        (event.target as IDBOpenDBRequest).error ??
        new Error(
          `Failed to connect to "${databaseName}" of version ${1} IndexedDB.`,
        );

      reject(error);
    };

    idbRequest.onsuccess = (event) => {
      resolve(true);
    };
  }).catch((error) => {
    return false;
  });

  return isAvailable;
}
