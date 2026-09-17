import { UnknownError } from "./unknown.js";

/**
 * @TODO update once minimum required version is 24.3
 */
export function isError(input: unknown): input is Error {
  // `Error.isError()` requires a NodeJS version 24.3+.

  return input instanceof Error;
}

export function validateError(input: unknown): asserts input is Error {
  if (!isError(input)) {
    throw new UnknownError(input);
  }
}
