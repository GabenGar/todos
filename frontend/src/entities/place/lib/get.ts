import { createValidator } from "#lib/json/schema";
import { IPaginatedCollection, createPagination } from "#lib/pagination";
import { logDebug } from "#lib/logs";
import { getLocalStoreItem } from "#browser/local-storage";
import { ITask, getAllTasks } from "#entities/task";
import type { IPlace, IPlacesCategory, IPlacesStatsAll } from "../types";

interface IOptions {
  page?: number;
  category?: IPlacesCategory;
}

const defaultOptions = {} as const satisfies IOptions;

const validatePlace = createValidator<IPlace>("/entities/place/entity");

export async function getPlace(placeID: IPlace["id"]) {
  const storedTasks = await getAllPlaces();
  const task = storedTasks.find(({ id }) => id === placeID);

  if (!task) {
    throw new Error(`No place with ID "${placeID}" exists.`);
  }

  return task;
}

export async function getPlaces(
  options: IOptions = defaultOptions,
): Promise<IPaginatedCollection<IPlace>> {
  logDebug(`Getting places...`);

  const { page, category } = options;
  const storedPlaces = await getAllPlaces();
  const storedTasks = await getAllTasks(false);
  const usedPlaceIDs = storedTasks.reduce<Set<ITask["id"]>>(
    (usedPlaces, task) => {
      if (task.place) {
        usedPlaces.add(task.place);
      }

      return usedPlaces;
    },
    new Set(),
  );
  const fileteredPlaces = storedPlaces.filter(({ id }) => {
    const isIncluded = !category ? true : usedPlaceIDs.has(id);

    return isIncluded;
  });
  const pagination = createPagination(fileteredPlaces.length, page);
  const items = storedPlaces.slice(pagination.offset, pagination.currentMax);
  const collection: IPaginatedCollection<IPlace> = {
    pagination,
    items,
  };

  logDebug(`Got ${items.length} places.`);

  return collection;
}

export async function getAllPlaces(): Promise<IPlace[]> {
  const storedPlaces = getLocalStoreItem<IPlace[]>("places", []);

  storedPlaces.forEach((place) => validatePlace(place));

  return storedPlaces;
}

export async function getPlacesStats() {
  const currentPlaces = await getAllPlaces();
  const currentTasks = await getAllTasks(false);
  const usedPlaceIDs = currentTasks.reduce<Set<ITask["id"]>>(
    (usedPlaces, task) => {
      if (task.place) {
        usedPlaces.add(task.place);
      }

      return usedPlaces;
    },
    new Set(),
  );

  const initStats: IPlacesStatsAll = {
    all: 0,
    eventless: 0,
  };
  const stats = currentPlaces.reduce<IPlacesStatsAll>((stats, place) => {
    stats.all = stats.all + 1;

    if (!usedPlaceIDs.has(place.id)) {
      stats.eventless = stats.eventless + 1;
    }

    return stats;
  }, initStats);

  return stats;
}
