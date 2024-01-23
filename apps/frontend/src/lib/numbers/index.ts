import { createValidator } from "#lib/json/schema";

export type INonNegativeInteger = number;

export const validateNonNegativeInteger = createValidator<INonNegativeInteger>(
  "/numbers/non-negative-integer",
);
export const validatePositiveInteger = createValidator<INonNegativeInteger>(
  "/numbers/positive-integer",
);
