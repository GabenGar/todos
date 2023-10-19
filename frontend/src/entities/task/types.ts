import { IPlace } from "#entities/place";
import type { IDateTime } from "#lib/dates";
import { IEntityItem } from "#lib/entities";
import type { INonNegativeInteger } from "#lib/numbers";
import { toQuotedStrings, type INanoidID } from "#lib/strings";

const statuses = ["pending", "in-progress", "finished", "failed"] as const;
type ITaskStatus = (typeof statuses)[number];

export function isTaskStatus(inputStatus: unknown): inputStatus is ITaskStatus {
  return statuses.includes(inputStatus as ITaskStatus);
}

export function validateTaskStatus(
  inputStatus: unknown,
): asserts inputStatus is ITaskStatus {
  if (!statuses.includes(inputStatus as ITaskStatus)) {
    throw new Error(
      `Unknown task status "${inputStatus}", expected statuses: ${toQuotedStrings(
        statuses,
      )}.`,
    );
  }
}

export interface ITaskStore {
  id: INanoidID;
  created_at: IDateTime;
  updated_at: IDateTime;
  deleted_at?: IDateTime;
  title: string;
  status: ITaskStatus;
  description?: string;
  place?: INanoidID;
}

export interface ITask extends Omit<ITaskStore, "place"> {
  place?: IEntityItem;
}

export interface ITaskInit
  extends Pick<ITask, "title" | "description">,
    Pick<Partial<ITask>, "status"> {
  place_id?: IPlace["id"];
}

export interface ITaskUpdate
  extends Pick<ITask, "id">,
    Pick<Partial<ITask>, "title" | "description" | "status" | "deleted_at"> {}

export interface ITaskStatsAll {
  all: INonNegativeInteger;
  pending: INonNegativeInteger;
  "in-progress": INonNegativeInteger;
  finished: INonNegativeInteger;
  failed: INonNegativeInteger;
}
