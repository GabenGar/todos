import { type IIDBTransaction } from "#store/indexed";
import { validatePlannedEventInit } from "./validate";
import type { IPlannedEvent, IPlannedEventInit } from "../types";
import {
  insertPlannedEvents,
  selectPlannedEventEntities,
} from "#browser/store/indexed/queries/planned-events";

export function createPlannedEvent(
  transaction: IIDBTransaction<"planned_events">,
  init: IPlannedEventInit,
  onSuccess: (plannedEvent: IPlannedEvent) => void,
): void {
  validatePlannedEventInit(init);

  insertPlannedEvents(transaction, [init], ([id]) => {
    selectPlannedEventEntities(transaction, [id], ([plannedEvent]) => {
      onSuccess(plannedEvent);
    });
  });
}
