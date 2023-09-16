import { logDebug } from "#lib/logs";
import { getLocalStoreItem } from "#browser/local-storage";
import { migrateTasks } from "./migrate";
import type { ITask } from "../types";

let isMigrated = false;

export async function getTask(taskID: ITask["id"]) {
  const tasks = await getTasks();

  const task = tasks.find(({ id, deleted_at }) => !deleted_at && id === taskID);

  if (!task) {
    throw new Error(`No task with ID "${taskID}" exists.`);
  }

  return task;
}

export async function getTasks(): Promise<ITask[]> {
  logDebug(`Getting tasks...`);

  if (!isMigrated) {
    try {
      await migrateTasks();
    } finally {
      isMigrated = true;
    }
  }

  const storedTasks = getLocalStoreItem<ITask[]>("todos", []);
  const tasks = storedTasks.filter(({ deleted_at }) => !deleted_at);

  logDebug(`Got ${tasks.length} tasks.`);

  return tasks;
}
