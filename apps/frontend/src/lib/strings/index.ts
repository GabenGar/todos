import type { nanoid } from "nanoid";

export type INanoidID = ReturnType<typeof nanoid>;
export type ITitle = string;
export type IDescription = string;

type IStringCollection = readonly string[] | Set<string>;

export function toQuotedStrings(
  stringCollection: IStringCollection,
  joiner = ",",
): string {
  const stringArray =
    stringCollection instanceof Set
      ? Array.from(stringCollection)
      : stringCollection;
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
 * Checks if `inputString` is a part of `parentString` case-insensitively.
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
