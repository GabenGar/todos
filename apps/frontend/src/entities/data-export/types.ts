import type { IPlace } from "#entities/place";
import type { ITaskStore } from "#entities/task";
import type { IDateTime } from "#lib/dates";
import type { INanoidID } from "#lib/strings";

export interface IDataExport {
  version: 1;
  id: INanoidID;
  created_at: IDateTime;
  data: {
    tasks?: ITaskStore[];
    places?: IPlace[];
  };
}
