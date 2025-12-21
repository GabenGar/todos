import { runMigrations } from "./migrations";
import { databaseName, databaseVersion } from "./types";

export function getDatabase(
  onError: (error: DOMException | Error) => void,
  onSuccess: (database: IDBDatabase) => void,
): void {
  const idbRequest = indexedDB.open(databaseName, databaseVersion);

  idbRequest.onerror = (event) => {
    const error =
      (event.target as IDBOpenDBRequest).error ??
      new Error(
        `Failed to connect to database "${databaseName}" of version ${databaseVersion}.`,
      );

    onError(error);
  };

  idbRequest.onupgradeneeded = runMigrations;

  idbRequest.onsuccess = (event) => {
    const db = (event.target as IDBOpenDBRequest).result;

    db.onversionchange = () => {
      db.close();
      alert(
        `Database "${databaseName}" of version "${databaseVersion}" is outdated, please reload the page.`,
      );
    };

    db.onclose = () => {
      console.log(
        `Database "${databaseName}" of version "${databaseVersion}" closed unexpectedly.`,
      );
    };

    onSuccess(db);
  };
}
