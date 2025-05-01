import type { IPlannedEvent, IPlannedEventInit } from "#entities/planned-event";
import type { IPlannedEventUpdate } from "entities/planned-event/types";

export interface IPlannedEventInitIDB
  extends IPlannedEventInit,
    Pick<
      IPlannedEvent,
      "created_at" | "updated_at" | "parsed_created_at" | "parsed_updated_at"
    > {}

export interface IPlannedEventUpdateIDB
  extends IPlannedEventUpdate,
    Pick<IPlannedEvent, "updated_at" | "parsed_updated_at"> {}
