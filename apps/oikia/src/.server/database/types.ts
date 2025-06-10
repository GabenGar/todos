import type { IPagination } from "@repo/ui/pagination";
import type { ITask } from "pg-promise";

export interface ITransaction
  extends Omit<ITask<unknown>, "task" | "taskIf" | "tx" | "txIf"> {}

export interface IEntityRow {
  id: string;
}

export interface ICountResult {
  count: ICount;
}

export interface IPaginatedFilter {
  pagination: IPagination
}

export type ICount = string;
