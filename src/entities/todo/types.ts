import type { DateTime } from "#lib/dates";

export interface ITodoInit extends Pick<ITodo, "title" | "description"> {}

export interface ITodo {
  id: string;
  created_at: DateTime;
  updated_at: DateTime;
  title: string;
  description?: string;
}

export interface ITodoUpdate
  extends Pick<ITodo, "id" | "title" | "description"> {}
