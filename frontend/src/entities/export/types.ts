import type { INanoidID } from "#lib/strings";
import type { ITodo } from "#entities/todo";
import { IDateTime } from "#lib/dates";

export interface IDataExport {
  version: 1;
  id: INanoidID;
  createdAt: IDateTime
  data: {
    todos: ITodo[];
  };
}
