import {
  getManyIndexedDBItems,
  getOneIndexedDBItem,
} from "#browser/store/indexed";
import type { IPlannedEvent } from "../types";
import { validatePlannedEvent } from "./validate";

export async function getPlannedEvents(): Promise<IPlannedEvent[]> {
  const plannedEvents = await getManyIndexedDBItems(
    "planned_events",
    validatePlannedEvent,
  );

  return plannedEvents;
}

export async function getPlannedEvent(
  id: IPlannedEvent["id"],
): Promise<IPlannedEvent> {
  const plannedEvent = await getOneIndexedDBItem(
    "planned_events",
    id,
    validatePlannedEvent,
  );

  return plannedEvent;
}
