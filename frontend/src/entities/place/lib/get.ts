import { createValidator, placeSchema } from "#lib/json/schema";
import { getLocalStoreItem } from "#browser/local-storage";
import type { IPlace } from "../types";

export async function getAllPlaces(includeDeleted = true): Promise<IPlace[]> {
  const validate: Awaited<ReturnType<typeof createValidator<IPlace>>> =
    await createValidator(placeSchema.$id);
  const storedPlaces = getLocalStoreItem<IPlace[]>("places", []);

  storedPlaces.forEach((place) => validate(place));

  const filteredPlaces = includeDeleted
    ? storedPlaces
    : storedPlaces.filter(({ deleted_at }) => !deleted_at);

  return filteredPlaces;
}
