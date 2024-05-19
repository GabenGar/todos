import { createValidator } from "#lib/json/schema";
import type { IPlannedEvent, IPlannedEventInit } from "../types";

export const validatePlannedEvent: ReturnType<
  typeof createValidator<IPlannedEvent>
> = createValidator<IPlannedEvent>("/entities/planned-event/entity");

export const validatePlannedEventInit: ReturnType<
  typeof createValidator<IPlannedEventInit>
> = createValidator<IPlannedEventInit>("/entities/planned-event/init");
