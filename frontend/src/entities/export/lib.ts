import { nanoid } from "nanoid";
import dataExportSchema from "#schema/entities/data-export.schema.json";
import { now } from "#lib/dates";
import { createValidator } from "#lib/json/schema";
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
    created_at: now(),
    data: {
      todos,
    },
  };

  const validate = await createValidator<IDataExport>(dataExportSchema.$id);

  validate(dataExport);

  return dataExport;
}
