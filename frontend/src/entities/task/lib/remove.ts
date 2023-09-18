import { logDebug } from "#lib/logs";
import { now } from "#lib/dates";
import { getLocalStoreItem } from "#browser/local-storage";
import type { ITask, ITaskUpdate } from "../types";
import { editTasks } from "./edit";

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

  const IDsForRemoval = new Set(ids);

  if (IDsForRemoval.size !== ids.length) {
    throw new Error(
      `The amount of IDs (${IDsForRemoval.size}) does not match the amount of removals (${ids.length}).`,
    );
  }

  const storedTasks = getLocalStoreItem<ITask[]>("todos", []);
  const tasksForRemoval = storedTasks.filter(({ id }) => IDsForRemoval.has(id));

  if (tasksForRemoval.length !== IDsForRemoval.size) {
    throw new Error(
      `The amount of tasks for removal (${tasksForRemoval.length}) is not equal to removed IDs (${IDsForRemoval.size}).`,
    );
  }
  const updates = tasksForRemoval.map<ITaskUpdate>(({ id }) => {
    return {
      id,
      deleted_at: now(),
    };
  });
  const updatedTasks = await editTasks(updates);

  logDebug(`Removed ${updatedTasks.length} tasks.`);

  return updatedTasks;
}
