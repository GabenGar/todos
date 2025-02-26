import type { ITask } from "pg-promise";

export interface ITransaction extends ITask<unknown> {}

export interface ITransactionFunction<ReturnShape> {
  (transaction: ITransaction): Promise<ReturnShape>;
}

export interface IEntityRow {
  id: string;
}
