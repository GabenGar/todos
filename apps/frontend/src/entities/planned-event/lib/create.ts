import { now } from "#lib/dates";
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

  const timestamp = now();
  const anotherInit: Omit<IPlannedEvent, "id"> = {
    ...init,
    created_at: timestamp,
    updated_at: timestamp,
  };

  insertPlannedEvents(transaction, [anotherInit], ([id]) => {
    selectPlannedEventEntities(transaction, [id], ([plannedEvent]) => {
      onSuccess(plannedEvent);
    });
  });
}
