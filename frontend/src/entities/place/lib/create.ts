import { nanoid } from "nanoid";
import { createValidator } from "#lib/json/schema";
import { logDebug } from "#lib/logs";
import { now } from "#lib/dates";
import { setLocalStorePlaces } from "./storage";
import { getAllPlaces } from "./get";
import type { IPlace, IPlaceInit } from "../types";

const validatePlaceInit = createValidator<IPlaceInit>("/entities/place/init");

export async function createPlace(init: IPlaceInit): Promise<IPlace> {
  const [place] = await createPlaces([init]);

  return place;
}

async function createPlaces(inits: IPlaceInit[]): Promise<IPlace[]> {
  logDebug(`Creating ${inits.length} places...`);

  inits.forEach((init) => validatePlaceInit(init));

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
