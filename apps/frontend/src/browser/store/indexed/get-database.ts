import { logInfo } from "#lib/logs";

const databaseName = "public";
const databaseVersion = 1;

let database: IDBDatabase | undefined = undefined;

export async function getDatabase(): Promise<IDBDatabase> {
  if (database) {
    return database;
  }

  const result = await new Promise<IDBDatabase>((resolve, reject) => {
    const idbRequest = indexedDB.open(databaseName, databaseVersion);

    idbRequest.onerror = (event) => {
      const error =
        (event.target as IDBOpenDBRequest).error ??
        new Error(
          `Failed to connect to "${databaseName}" of version ${1} IndexedDB.`,
        );

      reject(error);
    };

    idbRequest.onupgradeneeded = (event) => {
      const { oldVersion, newVersion } = event;
      const database = (event.target as IDBOpenDBRequest).result;
      logInfo(
        `IndexedDB: migrating database "${databaseName}" from version ${oldVersion} to ${newVersion}.`,
      );

      const store = database.createObjectStore("planned_events", {
        keyPath: "id",
        autoIncrement: true,
      });
    };

    idbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Generic error handler for all errors targeted at this database's requests
      db.onerror = (event) => {
        console.error(
          `IndexedDB storage error: ${
            // @ts-expect-error MDN code sayy it's a valid value
            (event.target as IDBDatabase).errorCode
          }`,
        );
      };

      db.onversionchange = (event) => {
        db.close();
        console.log(
          "A new version of this page is ready. Please reload or close this tab.",
        );
      };

      db.onclose = (event) => {
        console.log("Database closed unexpectedly.");
      };

      database = db;
      resolve(database);
    };
  });

  return result;
}

// jsut a rando comment for merge
