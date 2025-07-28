import type { IFormData } from "./types";

export function parseStringValueFromFormData<Field extends string = string>(
  formData: IFormData<Field>,
  keyName: Field,
): string | undefined {
  const value = formData.get(keyName);

  if (value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`Invalid value type for key "${keyName}".`);
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return undefined;
  }

  return trimmedValue;
}
