import { createValidator } from "#lib/json/schema";
import { logDebug } from "#lib/logs";
import { setLocalStoreItem } from "#browser/local-storage";
import { getAllPlaces } from "./get";
import { type IPlaceUpdate, type IPlace } from "../types";
import { now } from "#lib/dates";

const validatePlaceUpdate = createValidator<IPlaceUpdate>(
  "/entities/place/update",
);

export async function editPlace(update: IPlaceUpdate): Promise<IPlace> {
  const [place] = await editPlaces([update]);

  return place;
}

async function editPlaces(updates: IPlaceUpdate[]): Promise<IPlace[]> {
  logDebug(`Editing ${updates.length} places...`);

  updates.forEach((update) => validatePlaceUpdate(update));

  const storedPlaces = await getAllPlaces();
  const updateIDs = new Set(updates.map(({ id }) => id));

  if (updateIDs.size !== updates.length) {
    throw new Error(
      `The amount of IDs (${updateIDs.size}) does not match the amount of updates (${updates.length}).`,
    );
  }

  const placesWithUpdatedApplied = storedPlaces.map<IPlace>((place) => {
    if (!updateIDs.has(place.id)) {
      return place;
    }

    // non-updates are filtered beforehand
    const update = updates.find(({ id }) => id === place.id)!;
    const updatedTitle = !update.title
      ? place.title
      : place.title !== update.title
      ? update.title
      : place.title;
    const updatedDescription = !update.description
      ? place.description
      : place.description !== update.description
      ? update.description
      : place.description;
    const updatedDeletionDate = update.deleted_at ?? place.deleted_at;
    const updatedPlace: IPlace = {
      ...place,
      updated_at: now(),
      title: updatedTitle,
      description: updatedDescription,
      deleted_at: updatedDeletionDate,
    };
    return updatedPlace;
  });

  setLocalStoreItem("places", placesWithUpdatedApplied);

  const editedPlaces = placesWithUpdatedApplied.filter(({ id }) =>
    updateIDs.has(id),
  );

  logDebug(`Edited ${editedPlaces.length} places.`);

  return editedPlaces;
}
