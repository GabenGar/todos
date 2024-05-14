export async function getIndexedDBItem<
  GetType extends IDBValidKey | IDBKeyRange,
>(storeName: string, getter: GetType) {
  const transaction = await getTransaction([storeName], "readonly");
  const objectStore = transaction.objectStore(storeName);

  const request = objectStore.get(getter);

  request.onsuccess = (event) => {
    const result = (event.target as typeof request).result;
  };
}

export async function createIndexedDBItem<InitType>(
  storeName: string,
  init: InitType,
) {
  const transaction = await getTransaction([storeName], "readwrite");
  const objectStore = transaction.objectStore(storeName);

  const request = objectStore.add(init);
  request.onsuccess = (event) => {
    // event.target.result === customer.ssn;
  };
}

// export async function updateIndexedDBItem<UpdateType>(
//   storeName: string,
//   update: UpdateType,
// ) {
//   const transaction = await getTransaction([storeName], "readwrite");
//   const objectStore = transaction.objectStore(storeName);

//   const request = objectStore.put(update);

//   request.onsuccess = (event) => {};
// }

// export async function deleteIndexedDBItem<
//   DeleteType extends IDBValidKey | IDBKeyRange,
// >(storeName: string, deleter: DeleteType) {
//   const transaction = await getTransaction([storeName], "readwrite");
//   const objectStore = transaction.objectStore(storeName);

//   const request = objectStore.delete(deleter);

//   request.onsuccess = (event) => {
//     // It's gone!
//   };
// }

async function getTransaction(
  ...args: Parameters<IDBDatabase["transaction"]>
): Promise<IDBTransaction> {
  const db = await getDatabase();

  db.onversionchange = (event) => {
    db.close();
    console.log(
      "A new version of this page is ready. Please reload or close this tab.",
    );
  };

  db.onclose = (event) => {
    console.log(
      "Database closed unexpectedly."
    );
  }

  const transaction = db.transaction(...args);

  return transaction;
}

function getDatabase(): Promise<IDBDatabase> {
  const result = new Promise<IDBDatabase>((resolve, reject) => {
    const idbRequest = indexedDB.open("public", 1);

    idbRequest.onerror = (event) => {
      const error =
        (event.target as IDBOpenDBRequest).error ??
        new Error('Failed to connect to "public" indexed database.');

      reject(error);
    };

    idbRequest.onupgradeneeded = (event) => {
      const { oldVersion, newVersion } = event;
      const database = (event.target as IDBOpenDBRequest).result;
    };

    idbRequest.onsuccess = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Generic error handler for all errors targeted at this database's requests
      database.onerror = (event) => {
        console.error(
          `IndexedDB storage error: ${(event.target as IDBDatabase).errorCode}`,
        );
      };

      resolve(database);
    };
  });

  return result;
}
