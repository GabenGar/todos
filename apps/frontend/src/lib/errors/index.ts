export function isError(error: unknown): error is Error {
  return error instanceof Error;
}
export function validateError(error: unknown): asserts error is Error {
  if (!isError(error)) {
    throw error;
  }
}
