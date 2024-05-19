import { createOneIndexedDBItem } from "#store/indexed";
import { validatePlannedEvent } from "./validate";
import type { IPlannedEvent, IPlannedEventInit } from "../types";

export async function createPlannedEvent(
  init: IPlannedEventInit,
): Promise<IPlannedEvent> {
  const plannedEvent = await createOneIndexedDBItem(
    "planned_events",
    init,
    validatePlannedEvent,
  );

  return plannedEvent;
}
