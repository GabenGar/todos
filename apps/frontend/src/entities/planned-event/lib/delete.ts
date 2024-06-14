import { deleteOneIndexedDBItem } from "#browser/store/indexed";
import { validatePlannedEvent } from "./validate";
import type { IPlannedEvent } from "../types";

export async function deletePlannedEvent(id: IPlannedEvent["id"]) {
  const deletedPlannedEvent = await deleteOneIndexedDBItem(
    "planned_events",
    id,
    validatePlannedEvent,
  );

  return deletedPlannedEvent;
}
