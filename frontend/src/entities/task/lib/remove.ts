import { logDebug } from "#lib/logs";
import { setLocalStoreItem } from "#browser/local-storage";
import { getTasks } from "./get";
import type { ITask } from "../types";

export async function removeTask(id: ITask["id"]): Promise<ITask> {
  const [removedTask] = await removeTasks([id]);

  return removedTask;
}

/**
 * @param ids IDs of removed tasks. Must be unique.
 * @returns The removed tasks.
 */
async function removeTasks(ids: ITask["id"][]): Promise<ITask[]> {
  logDebug(`Removing ${ids.length} tasks...`);

  const removedIDs = new Set(ids);

  if (removedIDs.size !== ids.length) {
    throw new Error(
      `The amount of IDs (${removedIDs.size}) does not match the amount of removals (${ids.length}).`,
    );
  }

  const storedTasks = await getTasks();
  const filteredTasks = storedTasks.filter(({ id }) => !removedIDs.has(id));

  setLocalStoreItem("todos", filteredTasks);

  const removedTasks = storedTasks.filter(({ id }) => removedIDs.has(id));

  logDebug(`Removed ${removedTasks.length} tasks.`);

  return removedTasks;
}
