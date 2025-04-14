import { logInfo } from "#lib/logs";
import { databaseVersion } from "../types";

export function runMigrations(event: IDBVersionChangeEvent) {
  const { oldVersion, newVersion } = event;
  const database = (event.target as IDBOpenDBRequest).result;

  logInfo(
    `Migrating database "${databaseVersion}" from version ${oldVersion} to ${newVersion}...`,
  );

  switch (event.oldVersion) {
    case 0: {
      const store = database.createObjectStore("planned_events", {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  }

  logInfo(
    `Successfully migratie database "${databaseVersion}" from version ${oldVersion} to ${newVersion}.`,
  );
}
