/**
 * An error to wrap errors which are not instances of `Error` class.
 */
export class UnknownError extends Error {
  constructor(input: unknown) {
    super("Unknown Error", { cause: input });
  }
}
