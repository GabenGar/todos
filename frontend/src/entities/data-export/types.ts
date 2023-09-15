import type { INanoidID } from "#lib/strings";
import type { ITask } from "#entities/task";
import type { IDateTime } from "#lib/dates";

export interface IDataExport {
  version: 1;
  id: INanoidID;
  created_at: IDateTime;
  data: {
    tasks: ITask[];
  };
}
