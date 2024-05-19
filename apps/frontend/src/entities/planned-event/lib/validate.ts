import { createValidator } from "#lib/json/schema";
import type { IPlannedEvent, IPlannedEventInit } from "../types";

export const validatePlannedEvent = createValidator<IPlannedEvent>(
  "/entities/planned-event/entity",
);
export const validatePlannedEventInit = createValidator<IPlannedEventInit>(
  "/entities/planned-event/init",
);
