import type { IPlannedEvent } from "#entities/planned-event";
import type { IIDBTransaction } from "../../types";

export function deletePlannedEvents(
  transaction: IIDBTransaction<"planned_events">,
  ids: IPlannedEvent["id"][],
  onSuccess: (deletedEvents: IPlannedEvent[]) => void,
) {
  const objectStore = transaction.objectStore("planned_events");
  const deletedEvents: IPlannedEvent[] = [];
  const cursorRequest = objectStore.openCursor();

  cursorRequest.onsuccess = (event) => {
    const cursor = (event.target as typeof cursorRequest).result;

    if (cursor && deletedEvents.length < ids.length) {
      const currentEvent = cursor.value as IPlannedEvent;

      if (ids.includes(currentEvent.id)) {
        cursor.delete();
        deletedEvents.push(currentEvent);
      }

      cursor.continue();
    } else {
      if (deletedEvents.length !== ids.length) {
        throw new Error("Failed to delete all provided planned events.");
      }

      onSuccess(deletedEvents);
    }
  };
}
