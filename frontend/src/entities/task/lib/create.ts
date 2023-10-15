import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { logDebug } from "#lib/logs";
import { createValidator, taskInitSchema } from "#lib/json/schema";
import { setLocalStoreItem } from "#browser/local-storage";
import type { ITask, ITaskInit, ITaskStore } from "../types";
import { getAllTasks } from "./get";
import { toTasks } from "./to-tasks";

export async function createTask(init: ITaskInit): Promise<ITask> {
  const [newTask] = await createTasks([init]);

  return newTask;
}

/**
 * @param inits
 * @returns Added tasks.
 */
async function createTasks(inits: ITaskInit[]): Promise<ITask[]> {
  logDebug(`Creating ${inits.length} tasks...`);

  const validate: Awaited<ReturnType<typeof createValidator<ITaskInit>>> =
    await createValidator(taskInitSchema.$id);

  inits.forEach((init) => {
    validate(init);
  });

  const incomingTasks = inits.map(({ title, description, status }) => {
    const newTask: ITaskStore = {
      id: nanoid(),
      title,
      description,
      status: status ?? "pending",
      created_at: now(),
      updated_at: now(),
    };

    return newTask;
  });

  const currentTasks = await getAllTasks();

  const newTasks = [...currentTasks, ...incomingTasks];
  setLocalStoreItem("todos", newTasks);
  const createdTasks = await toTasks(incomingTasks);

  logDebug(`Created ${inits.length} tasks.`);

  return createdTasks;
}
