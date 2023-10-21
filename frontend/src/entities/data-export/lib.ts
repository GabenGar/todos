import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { createValidator, dataExportSchema } from "#lib/json/schema";
import { logDebug, logInfo } from "#lib/logs";
import { setLocalStoreItem } from "#browser/local-storage";
import { getAllTasks, type ITaskStore } from "#entities/task";
import { type IPlace, getAllPlaces } from "#entities/place";
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
    const updatedTasks = await importTasks(id, data.tasks);
    setLocalStoreItem("todos", updatedTasks);

    logDebug(`Imported tasks of data export "${id}".`);
  }

  if (data.places) {
    const updatedPlaces = await importPlaces(id, data.places);
    setLocalStoreItem("places", updatedPlaces);

    logDebug(`Imported places of data export "${id}".`);
  }

  logInfo(`Imported data export "${id}".`);
}

async function importTasks(
  exportID: IDataExport["id"],
  incomingTasks: ITaskStore[],
) {
  logDebug(
    `Importing ${incomingTasks.length} tasks of data export "${exportID}"...`,
  );

  const currentTasks = await getAllTasks(false);
  const currentIDs = currentTasks.map(({ id }) => id);
  const newTasks = incomingTasks.filter(({ id }) => !currentIDs.includes(id));

  const updatedTasks = currentTasks.map<ITaskStore>((currentTask) => {
    const changedTask = incomingTasks.find(({ id }) => id === currentTask.id);
    const isNotUpdated =
      !changedTask ||
      currentTask.deleted_at ||
      (currentTask.title === changedTask.title &&
        currentTask.description === changedTask.description &&
        currentTask.status === changedTask.status &&
        currentTask.place === changedTask.place);

    if (isNotUpdated) {
      return currentTask;
    } else {
      return changedTask;
    }
  });

  updatedTasks.push(...newTasks);

  return updatedTasks;
}

async function importPlaces(
  exportID: IDataExport["id"],
  incomingPlaces: IPlace[],
) {
  logDebug(
    `Importing ${incomingPlaces.length} places of data export "${exportID}"...`,
  );

  const currentPlaces = await getAllPlaces();
  const currentIDs = new Set(currentPlaces.map(({ id }) => id));
  const newPlaces = incomingPlaces.filter(({ id }) => !currentIDs.has(id));

  const updatedPlaces = currentPlaces.map<IPlace>((currentPlace) => {
    const changedPlace = incomingPlaces.find(
      ({ id }) => id === currentPlace.id,
    );
    const isNotUpdated =
      !changedPlace ||
      currentPlace.deleted_at ||
      (currentPlace.title === changedPlace.title &&
        currentPlace.description === changedPlace.description);

    if (isNotUpdated) {
      return currentPlace;
    } else {
      return changedPlace;
    }
  });

  updatedPlaces.push(...newPlaces);

  return updatedPlaces;
}
