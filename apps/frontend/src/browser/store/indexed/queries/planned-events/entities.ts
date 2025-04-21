import type { IPlannedEvent } from "#entities/planned-event";
import type { IIDBArgs } from "../../types";

interface IArgs extends IIDBArgs<"planned_events"> {
  ids: IPlannedEvent["id"][];
  order?: "recently_created" | "recently_updated";
}

export function selectPlannedEventEntities(
  { transaction, ids, order = "recently_created" }: IArgs,
  onSuccess: (plannedEvents: IPlannedEvent[]) => void,
) {
  const objectStore = transaction.objectStore("planned_events");
  const index = objectStore.index(order);
  const cursorRequest = index.openCursor();
  const plannedEvents: IPlannedEvent[] = [];

  cursorRequest.onsuccess = (event) => {
    const cursor = (event.target as typeof cursorRequest).result;

    if (cursor && plannedEvents.length < ids.length) {
      const plannedEvent = cursor.value as IPlannedEvent;

      plannedEvents.push(plannedEvent);
      cursor.continue();
    } else {
      if (plannedEvents.length === 0) {
        throw new Error("No planned events found for provided IDs.");
      }

      if (plannedEvents.length !== ids.length) {
        throw new Error("Amount of IDs and found planned events do not match.");
      }

      onSuccess(plannedEvents);
    }
  };
}
