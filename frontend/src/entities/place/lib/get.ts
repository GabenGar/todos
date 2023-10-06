import { createValidator, placeSchema } from "#lib/json/schema";
import { getLocalStoreItem } from "#browser/local-storage";
import type { IPlace } from "../types";
import { logDebug } from "#lib/logs";
import { IPaginatedCollection, createPagination } from "#lib/pagination";

interface IOptions {
  page?: number;
  // query?: string;
}

const defaultOptions = {} as const satisfies IOptions;

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
  const items = storedPlaces.slice(
    pagination.offset,
    pagination.currentMax + 1,
  );
  const collection: IPaginatedCollection<IPlace> = {
    pagination,
    items,
  };

  logDebug(`Got ${items.length} places.`);

  return collection;
}

export async function getAllPlaces(): Promise<IPlace[]> {
  const validate: Awaited<ReturnType<typeof createValidator<IPlace>>> =
    await createValidator(placeSchema.$id);
  const storedPlaces = getLocalStoreItem<IPlace[]>("places", []);

  storedPlaces.forEach((place) => validate(place));

  return storedPlaces;
}
