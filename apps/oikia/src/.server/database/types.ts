import type { ITask } from "pg-promise";

export interface ITransaction
  extends Omit<ITask<unknown>, "task" | "taskIf" | "tx" | "txIf"> {}

export interface IEntityRow {
  id: string;
}

export interface ICountResult {
  count: ICount;
}

export type ICount = string;
