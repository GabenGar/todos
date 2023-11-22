import { createValidator } from "#lib/json/schema";
import { IPaginatedCollection, createPagination } from "#lib/pagination";
import { logDebug } from "#lib/logs";
import { isSubstring } from "#lib/strings";
import { getLocalStoreItem } from "#browser/local-storage";
import { ITask, getAllTasks, getTasksStats } from "#entities/task";
import type {
  IPlace,
  IPlaceOverview,
  IPlacesCategory,
  IPlacesStatsAll,
} from "../types";

interface IOptions {
  page?: number;
  category?: IPlacesCategory;
  query?: string;
}

const defaultOptions = {} as const satisfies IOptions;

const validatePlace = createValidator<IPlace>("/entities/place/entity");

export async function getPlace(placeID: IPlace["id"]): Promise<IPlace> {
  const storedPlaces = await getAllPlaces();
  const place = storedPlaces.find(({ id }) => id === placeID);

  if (!place) {
    throw new Error(`No place with ID "${placeID}" exists.`);
  }


  return place;
}

export async function getPlaceStats(
  placeID: IPlace["id"],
): Promise<IPlaceOverview["stats"]> {
  const tasksStats = await getTasksStats(placeID);
  const stats: IPlaceOverview["stats"] = {
    tasks: tasksStats,
  };

  return stats;
}

export async function getPlaces(
  options: IOptions = defaultOptions,
): Promise<IPaginatedCollection<IPlace>> {
  logDebug(`Getting places...`);

  const { page, category, query } = options;
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
  const filteredPlaces = storedPlaces.filter(({ id, title, description }) => {
    const isMatchingCategory = !category ? true : !usedPlaceIDs.has(id);
    const isMatchingQuery = !query
      ? true
      : isSubstring(query, title) || isSubstring(query, description);

    const isIncluded = isMatchingCategory && isMatchingQuery;

    return isIncluded;
  });
  const pagination = createPagination(filteredPlaces.length, page);
  const items = filteredPlaces.slice(pagination.offset, pagination.currentMax);
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
