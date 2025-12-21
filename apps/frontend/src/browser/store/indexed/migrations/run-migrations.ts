import type { IPlannedEvent } from "#entities/planned-event";
import { toJavascriptDate } from "#lib/dates";
import { logInfo } from "#lib/logs";
import { databaseVersion, type IIDBTransaction } from "../types";

export function runMigrations(event: IDBVersionChangeEvent) {
  const { oldVersion, newVersion } = event;
  const transaction = (event.target as IDBOpenDBRequest)
    .transaction! as IIDBTransaction;

  logInfo(
    `Migrating database "${databaseVersion}" from version ${oldVersion} to ${newVersion}...`,
  );

  switch (oldVersion) {
    case 0: {
      runMigrationV0(transaction, (transaction) => runMigrationV1(transaction));
      break;
    }

    case 1: {
      runMigrationV1(transaction);
      break;
    }

    default: {
      throw new Error(`Unknown indexed DB version ${oldVersion}.`);
    }
  }

  logInfo(
    `Successfully migrated database "${databaseVersion}" from version ${oldVersion} to ${newVersion}.`,
  );
}

function runMigrationV0(
  transaction: IIDBTransaction,
  onSuccess?: (transaction: IIDBTransaction) => void,
) {
  const database = transaction.db;
  database.createObjectStore("planned_events", {
    keyPath: "id",
    autoIncrement: true,
  });

  onSuccess?.(transaction);
}

function runMigrationV1(
  transaction: IIDBTransaction,
  onSuccess?: (transaction: IIDBTransaction) => void,
) {
  const store = transaction.objectStore("planned_events");

  store.createIndex("recently_created", ["parsed_created_at", "id"], {
    unique: true,
  });
  store.createIndex("recently_updated", ["parsed_updated_at", "id"], {
    unique: true,
  });

  // update existing planned events without parsed fields
  const cursorRequest = store.openCursor();

  cursorRequest.onsuccess = (event) => {
    const cursor = (event.target as typeof cursorRequest).result;

    if (cursor) {
      const plannedEvent = cursor.value as IPlannedEvent;
      const isMissingParsedFields =
        !plannedEvent.parsed_created_at || !plannedEvent.parsed_updated_at;

      if (isMissingParsedFields) {
        const update = plannedEvent;

        if (!plannedEvent.parsed_created_at) {
          update.parsed_created_at = toJavascriptDate(update.created_at);
        }

        if (!plannedEvent.parsed_updated_at) {
          update.parsed_updated_at = toJavascriptDate(update.updated_at);
        }

        const updateRequest = cursor.update(update);

        updateRequest.onsuccess = () => {
          cursor.continue();
        };
      } else {
        cursor.continue();
      }
    } else {
      onSuccess?.(transaction);
    }
  };
}
