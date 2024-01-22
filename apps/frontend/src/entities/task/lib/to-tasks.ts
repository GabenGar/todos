import { getAllPlaces } from "#entities/place";
import { toEntityItem } from "#lib/entities";
import type { ITask, ITaskStore } from "../types";

export async function toTasks(storeTasks: ITaskStore[]): Promise<ITask[]> {
  const placeIDs = storeTasks.reduce<Set<Required<ITaskStore>["place"]>>(
    (placeIDs, { place }) => {
      if (!place) {
        return placeIDs;
      }

      placeIDs.add(place);

      return placeIDs;
    },
    new Set(),
  );

  const places = await getAllPlaces();
  const inputPlaces = places.filter(({ id }) => placeIDs.has(id));
  const tasks = storeTasks.map<ITask>(({ place: placeID, ...task }) => {
    const item: ITask = { ...task };

    if (placeID) {
      const place = inputPlaces.find(({ id }) => id === placeID)!;
      const placeItem = toEntityItem(place);

      item.place = placeItem;
    }

    return item;
  });

  return tasks;
}
