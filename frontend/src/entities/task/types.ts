import type { IDateTime } from "#lib/dates";
import { toQuotedStrings, type INanoidID } from "#lib/strings";

const statuses = ["pending", "in-progress", "finished", "failed"] as const;
type ITaskStatus = (typeof statuses)[number];

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

export interface ITask {
  id: INanoidID;
  created_at: IDateTime;
  updated_at: IDateTime;
  title: string;
  status: ITaskStatus;
  description?: string;
}

export interface ITaskInit
  extends Pick<ITask, "title" | "description">,
    Pick<Partial<ITask>, "status"> {}

export interface ITaskUpdate
  extends Pick<ITask, "id">,
    Pick<Partial<ITask>, "title" | "description" | "status"> {}
