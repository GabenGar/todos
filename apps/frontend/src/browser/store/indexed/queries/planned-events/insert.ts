import type { IPlannedEvent, IPlannedEventInit } from "#entities/planned-event";
import type { IIDBTransaction } from "../../types";

export function insertPlannedEvents(
  transaction: IIDBTransaction<"planned_events">,
  inits: IPlannedEventInit[],
  onSuccess: (ids: IPlannedEvent["id"][]) => void,
) {
  const objectStore = transaction.objectStore("planned_events");
  const ids: IPlannedEvent["id"][] = [];

  inits.forEach((init, index) => {
    const addRequest = objectStore.add(init);

    addRequest.onsuccess = (event) => {
      const newKey = (event.target as typeof addRequest)
        .result as IPlannedEvent["id"];

      ids.push(newKey);

      if (index === inits.length - 1) {
        onSuccess(ids);
      }
    };
  });
}
