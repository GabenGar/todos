import { NEWLINE } from "./types.js";

export { NEWLINE } from "./types.js";

export function createMultiLineString(...inputStrings: string[]): string {
  const multiLineString = inputStrings.join(NEWLINE);

  return multiLineString;
}
