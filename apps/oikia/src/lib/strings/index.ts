export function isEmptyString(input: unknown): input is string {
  if (typeof input !== "string") {
    return false;
  }

  const trimmedString = input.trim()

  if (trimmedString.length === 0) {
    return false;
  }

  return true
}
