import { createValidator } from "#lib/json/schema";

export type INonNegativeInteger = number;
export type IPositiveInteger = number;

export const validateNonNegativeInteger = createValidator<INonNegativeInteger>(
  "/numbers/non-negative-integer",
);
export const validatePositiveInteger = createValidator<IPositiveInteger>(
  "/numbers/positive-integer",
);
