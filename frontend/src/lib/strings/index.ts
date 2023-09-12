import type { nanoid } from "nanoid";

export type INanoidID = ReturnType<typeof nanoid>;

export function toQuotedStrings(
  stringArray: readonly string[],
  joiner = ",",
): string {
  const quotedStrings = stringArray.map((value) => `"${value}"`).join(joiner);

  return quotedStrings;
}
