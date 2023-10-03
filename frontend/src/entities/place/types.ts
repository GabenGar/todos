import type { IDateTime } from "#lib/dates";
import type { IDescription, INanoidID, ITitle } from "#lib/strings";

export interface IPlace {
  id: INanoidID;
  created_at: IDateTime;
  updated_at: IDateTime;
  deleted_at?: IDateTime;
  title: ITitle;
  description?: IDescription;
}

export interface IPlaceInit extends Pick<IPlace, "title" | "description"> {}

export interface IPlaceUpdate
  extends Pick<Required<IPlace>, "id">,
    Pick<Partial<IPlace>, "title" | "description" | "deleted_at"> {}
