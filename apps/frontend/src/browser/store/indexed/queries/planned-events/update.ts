import { now, toJavascriptDate } from "#lib/dates";
import type {
  IPlannedEvent,
  IPlannedEventUpdate,
} from "#entities/planned-event";
import type { IIDBTransaction } from "../../types";
import type { IPlannedEventUpdateIDB } from "./types";

/**
 * @TODO store in `Map()`s and `Set()`s
 */
export function updatePlannedEvents(
  transaction: IIDBTransaction<"planned_events">,
  updates: IPlannedEventUpdate[],
  onSuccess: (ids: IPlannedEvent["id"][]) => void,
) {
  const timestamp = now();
  const idbUpdates = updates.map<IPlannedEventUpdateIDB>((init) => {
    const idbUpdate: IPlannedEventUpdateIDB = {
      ...init,
      updated_at: timestamp,
      parsed_updated_at: toJavascriptDate(timestamp),
    };

    return idbUpdate;
  });
  const objectStore = transaction.objectStore("planned_events");
  const updateIDs = idbUpdates.map(({ id }) => id);
  const ids: IPlannedEvent["id"][] = [];

  // IDB doesn't support partial updates
  // https://stackoverflow.com/a/51542210
  // therefoe doing partial updates with cursor
  // https://www.huy.rocks/everyday/03-17-2022-javascript-partial-update-an-object-in-indexeddb
  const cursorRequest = objectStore.openCursor();

  cursorRequest.onsuccess = (event) => {
    const cursor = (event.target as typeof cursorRequest).result;

    if (cursor && idbUpdates.length < ids.length) {
      const currentID = (cursor.value as IPlannedEvent).id;

      if (updateIDs.includes(currentID)) {
        const currentEvent = cursor.value as IPlannedEvent;
        const update = idbUpdates.find(({ id }) => id === currentID)!;
        const incomingUpdate = { ...currentEvent, ...update };

        cursor.update(incomingUpdate);
        ids.push(currentEvent.id);
      }

      cursor.continue();
    } else {
      if (ids.length !== updateIDs.length) {
        throw new Error("Failed to update all provided planned events.");
      }

      onSuccess(ids);
    }
  };
}
