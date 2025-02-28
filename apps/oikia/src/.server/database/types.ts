import type { ITask } from "pg-promise";

export interface ITransaction extends ITask<unknown> {}

export interface IEntityRow {
  id: string;
}

export interface ICountResult {
  count: ICount;
}

export type ICount = string;
