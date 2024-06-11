import { now } from "#lib/dates";
import { getOneIndexedDBItem, updateOneIndexedDBItem } from "#store/indexed";
import { validatePlannedEvent, validatePlannedEventUpdate } from "./validate";
import type { IPlannedEvent, IPlannedEventUpdate } from "../types";

export async function editPlannedEvent(
  update: IPlannedEventUpdate,
): Promise<IPlannedEvent> {
  validatePlannedEventUpdate(update);

  const { id, ...updateBody } = update;
  const timestamp = now();

  const currentEvent = await getOneIndexedDBItem(
    "planned_events",
    id,
    validatePlannedEvent,
  );

  const incomingUpdate: IPlannedEvent = {
    ...currentEvent,
    ...updateBody,
    updated_at: timestamp,
  };

  const updatedEvent = await updateOneIndexedDBItem(
    "planned_events",
    incomingUpdate,
    validatePlannedEvent,
  );

  return updatedEvent;
}
