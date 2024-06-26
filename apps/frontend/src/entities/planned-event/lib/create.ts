import { createOneIndexedDBItem } from "#store/indexed";
import { validatePlannedEvent, validatePlannedEventInit } from "./validate";
import type { IPlannedEvent, IPlannedEventInit } from "../types";
import { now } from "#lib/dates";

export async function createPlannedEvent(
  init: IPlannedEventInit,
): Promise<IPlannedEvent> {
  validatePlannedEventInit(init);

  const timestamp = now();
  const anotherInit: Omit<IPlannedEvent, "id"> = {
    ...init,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const plannedEvent = await createOneIndexedDBItem(
    "planned_events",
    anotherInit,
    validatePlannedEvent,
  );

  return plannedEvent;
}
