import type { IIDBTransaction } from "#store/indexed";
import {
  insertPlannedEvents,
  selectPlannedEventEntities,
} from "#store/indexed/queries/planned-events";
import type { IPlannedEvent, IPlannedEventInit } from "../types";
import { validatePlannedEventInit } from "./validate";

export function createPlannedEvent(
  transaction: IIDBTransaction<"planned_events">,
  init: IPlannedEventInit,
  onSuccess: (plannedEvent: IPlannedEvent) => void,
): void {
  validatePlannedEventInit(init);

  insertPlannedEvents(transaction, [init], ([id]) => {
    selectPlannedEventEntities({ transaction, ids: [id] }, ([plannedEvent]) => {
      onSuccess(plannedEvent);
    });
  });
}
