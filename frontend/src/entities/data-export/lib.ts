import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { createValidator, dataExportSchema } from "#lib/json/schema";
import { logDebug, logInfo } from "#lib/logs";
import { setLocalStoreItem } from "#browser/local-storage";
import { type ITask, getAllTasks } from "#entities/task";
import { getAllPlaces } from "#entities/place";
import type { IDataExport } from "./types";

export async function createDataExport(): Promise<IDataExport> {
  const tasks = await getAllTasks(false);
  const places = await getAllPlaces();

  const dataExport: IDataExport = {
    version: 1,
    id: nanoid(),
    created_at: now(),
    data: {},
  };

  if (tasks.length) {
    dataExport.data.tasks = tasks;
  }

  if (places.length) {
    dataExport.data.places = places;
  }

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
  const { id, version, data } = dataExport;
  logDebug(`Validated data export "${id}" of version "${version}".`);

  if (data.tasks) {
    const updatedTasks = await importTasks(data.tasks, id);
    setLocalStoreItem("todos", updatedTasks);

    logDebug(`Imported tasks of data export "${id}".`);
  }

  logInfo(`Imported data export "${id}".`);
}

async function importTasks(
  incomingTasks: ITask[],
  exportID: IDataExport["id"],
) {
  logDebug(
    `Importing ${incomingTasks.length} tasks of data export "${exportID}"...`,
  );

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
