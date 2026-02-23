import type { IIDBTransaction } from "#store/indexed";
import { updatePlannedEvents } from "#store/indexed/queries/planned-events";
import type { IPlannedEvent, IPlannedEventUpdate } from "../types";
import { getPlannedEvent } from "./get";
import { validatePlannedEventUpdate } from "./validate";

export function editPlannedEvent(
  transaction: IIDBTransaction<"planned_events">,
  update: IPlannedEventUpdate,
  onSuccess: (updatedEvent: IPlannedEvent) => void,
): void {
  validatePlannedEventUpdate(update);

  const id = update.id;

  getPlannedEvent({ transaction, id }, () => {
    updatePlannedEvents(transaction, [update], ([updatedEventID]) => {
      getPlannedEvent({ transaction, id: updatedEventID }, (updatedEvent) => {
        onSuccess(updatedEvent);
      });
    });
  });
}
