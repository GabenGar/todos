import type { IDateTime } from "#lib/dates";
import type { IDescription, ITitle } from "#lib/strings";

export interface IPlannedEvent {
  id: number;
  created_at: IDateTime;
  updated_at: IDateTime;
  parsed_created_at: Date;
  parsed_updated_at: Date;
  title: ITitle;
  description?: IDescription;
}

export interface IPlannedEventInit
  extends Pick<IPlannedEvent, "title" | "description"> {}

export interface IPlannedEventUpdate
  extends Pick<Required<IPlannedEvent>, "id">,
    Pick<Partial<IPlannedEvent>, "title" | "description"> {}
