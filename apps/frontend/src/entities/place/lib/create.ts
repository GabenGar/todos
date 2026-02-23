import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { createValidator } from "#lib/json/schema";
import { logDebug } from "#lib/logs";
import type { IPlace, IPlaceInit } from "../types";
import { getAllPlaces } from "./get";
import { setLocalStorePlaces } from "./storage";

const validatePlaceInit: ReturnType<typeof createValidator<IPlaceInit>> =
  createValidator<IPlaceInit>("/entities/place/init");

export async function createPlace(init: IPlaceInit): Promise<IPlace> {
  const [place] = await createPlaces([init]);

  return place;
}

async function createPlaces(inits: IPlaceInit[]): Promise<IPlace[]> {
  logDebug(`Creating ${inits.length} places...`);

  inits.forEach((init) => {
    validatePlaceInit(init);
  });

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
  await setLocalStorePlaces(newPlaces);

  logDebug(`Created ${inits.length} places.`);

  return incomingPlaces;
}
