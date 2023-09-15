import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { logDebug } from "#lib/logs";
import {
  createValidator,
  taskInitSchema,
  taskUpdateSchema,
} from "#lib/json/schema";
import { getLocalStoreItem, setLocalStoreItem } from "#browser/local-storage";
import { migrateTasks } from "./migrate";
import type { ITask, ITaskInit, ITaskUpdate } from "./types";

let isMigrated = false;

export async function getTask(taskID: ITask["id"]) {
  const tasks = await getTasks();

  const task = tasks.find(({ id }) => id === taskID);

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

  const tasks = getLocalStoreItem<ITask[]>("todos", []);

  logDebug(`Got ${tasks.length} tasks.`);

  return tasks;
}

export async function createTask(init: ITaskInit): Promise<ITask> {
  const validate: Awaited<ReturnType<typeof createValidator<ITaskInit>>> =
    await createValidator(taskInitSchema.$id);
  validate(init);

  const [newTask] = await createTasks([init]);

  return newTask;
}

/**
 * @param inits
 * @returns Added tasks.
 */
async function createTasks(inits: ITaskInit[]): Promise<ITask[]> {
  logDebug(`Creating ${inits.length} tasks...`);

  const incomingTasks = inits.map(({ title, description, status }) => {
    const newTask: ITask = {
      id: nanoid(),
      title,
      description,
      status: status ?? "pending",
      created_at: now(),
      updated_at: now(),
    };

    return newTask;
  });

  const currentTasks = await getTasks();

  const newTasks = [...currentTasks, ...incomingTasks];
  setLocalStoreItem("todos", newTasks);

  logDebug(`Created ${inits.length} tasks.`);

  return incomingTasks;
}

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
async function editTasks(updates: ITaskUpdate[]): Promise<ITask[]> {
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
    const updatedTask: ITask = {
      ...task,
      updated_at: now(),
      title: updatedTitle,
      description: updatedDescription,
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
