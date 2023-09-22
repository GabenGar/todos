import type { nanoid } from "nanoid";

export type INanoidID = ReturnType<typeof nanoid>;

export function toQuotedStrings(
  stringArray: readonly string[],
  joiner = ",",
): string {
  const quotedStrings = stringArray
    .map((value) => toQuotedString(value))
    .join(joiner);

  return quotedStrings;
}

export function toQuotedString(inputString: string): string {
  const quotedString = `"${inputString}"`;

  return quotedString;
}

/**
 * Checks if `inputString` is a part of `parentString`.
 * @returns
 * `true` if `inputString` is a part of `parentString`, otherwise `false`.
 */
export function isSubstring(
  inputString: string,
  parentString?: string,
): boolean {
  const normalizedInputString = inputString.trim().toLowerCase();
  const normalizedParentString = parentString?.trim().toLowerCase();
  const result = Boolean(
    normalizedParentString?.includes(normalizedInputString),
  );

  return result;
}
