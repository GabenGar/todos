import type { ParsedUrlQuery } from "node:querystring";

export function getSingleValueFromQuery(
  query: ParsedUrlQuery,
  key: string,
): string | undefined {
  const value = query[key];
  const inputValue = !Array.isArray(value) ? value?.trim() : value[1].trim();
  const parsedValue =
    !inputValue || inputValue.length !== 0 ? undefined : inputValue;

  return parsedValue;
}
