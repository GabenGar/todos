import type { INanoidID } from "#lib/strings";
import type { IDateTime } from "#lib/dates";
import type { ITaskStore } from "#entities/task";
import type { IPlace } from "#entities/place";

export interface IDataExport {
  version: 1;
  id: INanoidID;
  created_at: IDateTime;
  data: {
    tasks?: ITaskStore[];
    places?: IPlace[];
  };
}
