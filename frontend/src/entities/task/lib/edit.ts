import { now } from "#lib/dates";
import { logDebug } from "#lib/logs";
import { createValidator, taskUpdateSchema } from "#lib/json/schema";
import { setLocalStoreItem } from "#browser/local-storage";
import { getTasks } from "./get";
import type { ITask, ITaskUpdate } from "../types";

export async function editTask(update: ITaskUpdate): Promise<ITask> {
  const validate: Awaited<ReturnType<typeof createValidator<ITaskUpdate>>> =
    await createValidator(taskUpdateSchema.$id);
  validate(update);

  const [editedTask] = await editTasks([update]);

  return editedTask;
}

/**
 * @param updates Incoming updates. It it assumed they have unique ids.
 * @returns The edited tasks.
 */
export async function editTasks(updates: ITaskUpdate[]): Promise<ITask[]> {
  logDebug(`Editing ${updates.length} tasks...`);

  const storedTasks = await getTasks();
  const updateIDs = new Set(updates.map(({ id }) => id));

  if (updateIDs.size !== updates.length) {
    throw new Error(
      `The amount of IDs (${updateIDs.size}) does not match the amount of updates (${updates.length}).`,
    );
  }

  const tasksWithUpdatedApplied = storedTasks.map<ITask>((task) => {
    if (!updateIDs.has(task.id)) {
      return task;
    }

    // non-updates are filtered beforehand
    const update = updates.find(({ id }) => id === task.id)!;
    const updatedTitle = !update.title
      ? task.title
      : task.title !== update.title
      ? update.title
      : task.title;
    const updatedDescription = !update.description
      ? task.description
      : task.description !== update.description
      ? update.description
      : task.description;
    const updatedStatus = !update.status
      ? task.status
      : task.status !== update.status
      ? update.status
      : task.status;
    const updatedTask: ITask = {
      ...task,
      updated_at: now(),
      title: updatedTitle,
      description: updatedDescription,
      status: updatedStatus,
    };

    return updatedTask;
  });

  setLocalStoreItem("todos", tasksWithUpdatedApplied);

  const editedTasks = tasksWithUpdatedApplied.filter(({ id }) =>
    updateIDs.has(id),
  );

  logDebug(`Edited ${editedTasks.length} tasks.`);

  return editedTasks;
}
