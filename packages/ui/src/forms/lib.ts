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

/**
 * Converts form data to search params.
 * Skips keys with no values.
 * Throws if any of the values is not a string.
 */
export function formDataToURLSearchParams(formData: FormData): URLSearchParams {
  const searchParams = new URLSearchParams();

  for (const key of formData.keys()) {
    const values = formData.getAll(key);

    if (values.length === 0) {
      continue;
    }

    values.forEach((value, index) => {
      if (typeof value !== "string") {
        throw new Error(
          `The value for key "${key}" at index ${index} is not a string.`,
        );
      }

      searchParams.append(key, value);
    });
  }

  return searchParams;
}
