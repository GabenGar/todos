import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { getTodos } from "#entities/todo";
import type { IDataExport } from "./types";

export async function createDataExport(): Promise<IDataExport> {
  const todos = await getTodos();

  if (todos.length === 0) {
    throw new Error(`There is nothing to export.`);
  }

  const dataExport: IDataExport = {
    version: 1,
    id: nanoid(),
    createdAt: now(),
    data: {
      todos,
    },
  };

  return dataExport;
}
