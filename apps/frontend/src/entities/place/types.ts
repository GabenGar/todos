import type { IDateTime } from "#lib/dates";
import type { INonNegativeInteger } from "#lib/numbers";
import type { IDescription, INanoidID, ITitle } from "#lib/strings";
import { ITasksStats } from "#entities/task";

export interface IPlace {
  id: INanoidID;
  created_at: IDateTime;
  updated_at: IDateTime;
  deleted_at?: IDateTime;
  title: ITitle;
  description?: IDescription;
}

export interface IPlaceOverview {
  stats: IPlaceStats;
}

interface IPlaceStats {
  tasks: ITasksStats;
}

export interface IPlaceInit extends Pick<IPlace, "title" | "description"> {}

export interface IPlaceUpdate
  extends Pick<Required<IPlace>, "id">,
    Pick<Partial<IPlace>, "title" | "description" | "deleted_at"> {}

export interface IPlacesStatsAll {
  all: INonNegativeInteger;
  eventless: INonNegativeInteger;
}

const placeCategories = ["eventless"] as const;
export type IPlacesCategory = (typeof placeCategories)[number];

export function isPlaceCategory(input: unknown): input is IPlacesCategory {
  return placeCategories.includes(input as IPlacesCategory);
}
