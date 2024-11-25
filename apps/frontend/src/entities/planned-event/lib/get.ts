import {
  getManyIndexedDBItems,
  getOneIndexedDBItem,
  countIndexedDBItems,
} from "#browser/store/indexed";
import type { IPaginatedCollection } from "#lib/pagination";
import type { IPlannedEvent } from "../types";
import { validatePlannedEvent } from "./validate";

export async function countPlannedEvents(): Promise<number> {
  const count = await countIndexedDBItems("planned_events");

  return count;
}

export async function getPlannedEvents(
  page?: number,
): Promise<IPaginatedCollection<IPlannedEvent>> {
  const plannedEvents = await getManyIndexedDBItems(
    "planned_events",
    validatePlannedEvent,
    page,
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
