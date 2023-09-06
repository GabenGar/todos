import type { INanoidID } from "#lib/strings";
import type { ITodo } from "#entities/todo";
import { IDateTime } from "#lib/dates";

export interface IDataExport {
  version: 1;
  id: INanoidID;
  created_at: IDateTime
  data: {
    todos: ITodo[];
  };
}
