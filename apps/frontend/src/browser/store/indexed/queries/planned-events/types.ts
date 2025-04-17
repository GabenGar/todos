import type { IPlannedEvent, IPlannedEventInit } from "#entities/planned-event";

export interface IPlannedEventInitIDB
  extends IPlannedEventInit,
    Pick<
      IPlannedEvent,
      "created_at" | "updated_at" | "parsed_created_at" | "parsed_updated_at"
    > {}
