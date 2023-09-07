import { nanoid } from "nanoid";
import dataExportSchema from "#schema/entities/data-export.schema.json";
import { now } from "#lib/dates";
import { createValidator } from "#lib/json/schema";
import { getTodos } from "#entities/todo";
import type { IDataExport } from "./types";

export async function createDataExport(): Promise<IDataExport> {
  const tasks = await getTodos();

  const dataExport: IDataExport = {
    version: 1,
    id: nanoid(),
    created_at: now(),
    data: {
      tasks,
    },
  };

  const validate: Awaited<ReturnType<typeof createValidator<IDataExport>>> =
    await createValidator<IDataExport>(dataExportSchema.$id);

  validate(dataExport);

  return dataExport;
}

export async function consumeDataExport(dataExport: unknown) {
  const validate: Awaited<ReturnType<typeof createValidator<IDataExport>>> =
    await createValidator<IDataExport>(dataExportSchema.$id);

  validate(dataExport);
}
