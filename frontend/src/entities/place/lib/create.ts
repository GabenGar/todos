import { nanoid } from "nanoid";
import { createValidator, placeInitSchema } from "#lib/json/schema";
import { logDebug } from "#lib/logs";
import { now } from "#lib/dates";
import { setLocalStoreItem } from "#browser/local-storage";
import { getAllPlaces } from "./get";
import type { IPlace, IPlaceInit } from "../types";

export async function createPlace(init: IPlaceInit): Promise<IPlace> {
  const [place] = await createPlaces([init]);

  return place;
}

async function createPlaces(inits: IPlaceInit[]): Promise<IPlace[]> {
  logDebug(`Creating ${inits.length} places...`);

  const validate: Awaited<ReturnType<typeof createValidator<IPlaceInit>>> =
    await createValidator(placeInitSchema.$id);

  inits.forEach((init) => validate(init));

  const incomingPlaces = inits.map(({ title, description }) => {
    const newPlace: IPlace = {
      id: nanoid(),
      created_at: now(),
      updated_at: now(),
      title,
      description,
    };

    return newPlace;
  });

  const currentPlaces = await getAllPlaces();

  const newPlaces = [...currentPlaces, ...incomingPlaces];
  setLocalStoreItem("places", newPlaces);

  logDebug(`Created ${inits.length} places.`);

  return incomingPlaces;
}
