import { createValidator } from "#lib/json/schema";
import type {
  IPlannedEvent,
  IPlannedEventInit,
  IPlannedEventUpdate,
} from "../types";

export const validatePlannedEvent: ReturnType<
  typeof createValidator<IPlannedEvent>
> = createValidator<IPlannedEvent>("/entities/planned-event/entity");

export const validatePlannedEventInit: ReturnType<
  typeof createValidator<IPlannedEventInit>
> = createValidator<IPlannedEventInit>("/entities/planned-event/init");

export const validatePlannedEventUpdate: ReturnType<
  typeof createValidator<IPlannedEventUpdate>
> = createValidator<IPlannedEventUpdate>("/entities/planned-event/update");
