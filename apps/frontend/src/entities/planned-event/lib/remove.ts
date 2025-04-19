import type { IIDBTransaction } from "#store/indexed";
import { deletePlannedEvents } from "#store/indexed/queries/planned-events";
import type { IPlannedEvent } from "../types";

export function removePlannedEvent(
  transaction: IIDBTransaction<"planned_events">,
  id: IPlannedEvent["id"],
  onSuccess: (deletedEvent: IPlannedEvent) => void,
) {
  deletePlannedEvents(transaction, [id], ([deletedEvent]) =>
    onSuccess(deletedEvent),
  );
}
