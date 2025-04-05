import { isObject } from "#lib/objects";
import { isNonEmptyString } from "#lib/strings";
import type { IAPIError, IFailedAPIResponse } from "./types";

export function isFailedAPIResponse(
  input: unknown
): input is IFailedAPIResponse {
  const isValidObject =
    isObject(input) &&
    "is_successful" in input &&
    input.is_successful === false &&
    "errors" in input &&
    Array.isArray(input.errors);

  if (!isValidObject) {
    return false;
  }

  const isValidErrors = (input.errors as unknown[]).every((value) =>
    isAPIError(value)
  );

  if (!isValidErrors) {
    return false;
  }

  return true;
}

export function isAPIError(input: unknown): input is IAPIError {
  const isValid =
    isObject(input) &&
    "name" in input &&
    isNonEmptyString(input.name) &&
    "message" in input &&
    isNonEmptyString(input.message);

  return isValid;
}
