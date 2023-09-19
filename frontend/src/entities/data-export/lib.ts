import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { createValidator, dataExportSchema } from "#lib/json/schema";
import { logDebug, logInfo } from "#lib/logs";
import { setLocalStoreItem } from "#browser/local-storage";
import { type ITask, getTasks, getAllTasks } from "#entities/task";
import type { IDataExport } from "./types";

export async function createDataExport(): Promise<IDataExport> {
  const tasks = await getAllTasks(false);

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

export async function importDataExport(dataExport: unknown) {
  logInfo(`Importing data export...`);

  logDebug(`Validating data export...`);

  const validate: Awaited<ReturnType<typeof createValidator<IDataExport>>> =
    await createValidator<IDataExport>(dataExportSchema.$id);

  validate(dataExport);

  logDebug(
    `Validated data export "${dataExport.id}" of version "${dataExport.version}".`,
  );

  logDebug(
    `Importing ${dataExport.data.tasks.length} tasks of data export "${dataExport.id}"...`,
  );

  const updatedTasks = await importTasks(dataExport.data.tasks);
  setLocalStoreItem("todos", updatedTasks);

  logDebug(`Imported tasks of data export "${dataExport.id}".`);

  logInfo(`Imported data export "${dataExport.id}".`);
}

async function importTasks(incomingTasks: ITask[]) {
  const currentTasks = await getAllTasks(false);
  const currentIDs = currentTasks.map(({ id }) => id);
  const newTasks = incomingTasks.filter(({ id }) => !currentIDs.includes(id));

  const updatedTasks = currentTasks.map<ITask>((currentTask) => {
    const changedTask = incomingTasks.find(({ id }) => id === currentTask.id);
    const isNotUpdated =
      !changedTask ||
      currentTask.deleted_at ||
      (currentTask.title === changedTask.title &&
        currentTask.description === changedTask.description &&
        currentTask.status === changedTask.status);

    if (isNotUpdated) {
      return currentTask;
    } else {
      return changedTask;
    }
  });

  updatedTasks.push(...newTasks);

  return updatedTasks;
}
