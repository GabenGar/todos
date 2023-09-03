import type { IDateTime } from "#lib/dates";
import type { INanoidID } from "#lib/strings";

export interface ITodoInit extends Pick<ITodo, "title" | "description"> {}

export interface ITodo {
  id: INanoidID
  created_at: IDateTime;
  updated_at: IDateTime;
  title: string;
  description?: string;
}

export interface ITodoUpdate
  extends Pick<ITodo, "id" | "title" | "description"> {}
