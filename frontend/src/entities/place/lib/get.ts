import { createValidator } from "#lib/json/schema";
import { IPaginatedCollection, createPagination } from "#lib/pagination";
import { logDebug } from "#lib/logs";
import { getLocalStoreItem } from "#browser/local-storage";
import type { IPlace, IPlacesStatsAll } from "../types";

interface IOptions {
  page?: number;
  // query?: string;
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

  const { page } = options;
  const storedPlaces = await getAllPlaces();
  const pagination = createPagination(storedPlaces.length, page);
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

  const initStats: IPlacesStatsAll = {
    all: 0,
  };
  const stats = currentPlaces.reduce<IPlacesStatsAll>((stats, task) => {
    stats.all = stats.all + 1;

    return stats;
  }, initStats);

  return stats;
}
