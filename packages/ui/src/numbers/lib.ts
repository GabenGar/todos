import { BIGINT_ZERO } from "./bigint";

export function parsePositiveInteger(input: string): bigint {
  const parsedValue = BigInt(input);

  if (!(parsedValue > BIGINT_ZERO)) {
    throw new Error(`Number ${input} is not a positive integer.`);
  }

  return parsedValue;
}
