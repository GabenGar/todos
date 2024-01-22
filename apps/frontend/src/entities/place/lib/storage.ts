import { createValidator } from "#lib/json/schema";
import { createLocalStorage } from "#browser/store/local";
import type { IPlace } from "../types";

const validatePlace = createValidator<IPlace>("/entities/place/entity");

function validatePlacesKey(input: unknown): asserts input is IPlace[] {
  if (!Array.isArray(input)) {
    throw new Error(`The value of "tasks" is not an array.`);
  }

  input.forEach((value) => validatePlace(value));
}

const { get, set } = createLocalStorage("places", [], validatePlacesKey);

export const getLocalStorePlaces = get;
export const setLocalStorePlaces = set;
