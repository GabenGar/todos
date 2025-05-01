import type { IPlannedEvent } from "#entities/planned-event";
import type { IIDBArgs } from "../../types";

interface IArgs extends IIDBArgs<"planned_events"> {
  ids: IPlannedEvent["id"][];
}

export function selectPlannedEventEntities(
  { transaction, ids }: IArgs,
  onSuccess: (plannedEvents: IPlannedEvent[]) => void,
) {
  const objectStore = transaction.objectStore("planned_events");

  if (ids.length === 1) {
    const id = ids[0];
    const entityRequest = objectStore.get(id);

    entityRequest.onsuccess = (event) => {
      const plannedEvent = (event.target as typeof entityRequest).result as
        | undefined
        | IPlannedEvent;

      if (!plannedEvent) {
        throw new Error(`No planned event exists for ID "${id}".`);
      }

      onSuccess([plannedEvent]);
    };
  } else {
    const cursorRequest = objectStore.openCursor();
    const plannedEvents: IPlannedEvent[] = [];

    cursorRequest.onsuccess = (event) => {
      const cursor = (event.target as typeof cursorRequest).result;

      if (cursor && plannedEvents.length < ids.length) {
        const plannedEvent = cursor.value as IPlannedEvent;

        if (ids.includes(plannedEvent.id)) {
          plannedEvents.push(plannedEvent);
        }

        cursor.continue();
      } else {
        if (plannedEvents.length === 0) {
          throw new Error("No planned events found for provided IDs.");
        }

        if (plannedEvents.length !== ids.length) {
          throw new Error(
            "Amount of IDs and found planned events do not match.",
          );
        }

        const orderedEvents = ids.map(
          (id) => plannedEvents.find((plannedEvent) => plannedEvent.id === id)!,
        );
        onSuccess(orderedEvents);
      }
    };
  }
}
