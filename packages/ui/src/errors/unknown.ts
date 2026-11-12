export class UnknownError extends Error {
  constructor(error: unknown) {
    super("Unknown Error.", { cause: error });
  }
}
