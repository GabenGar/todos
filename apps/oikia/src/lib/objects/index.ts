export function isObject(input: unknown): input is object {
  const isValid = typeof input === "object" && input !== null;

  return isValid;
}
