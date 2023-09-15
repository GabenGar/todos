import { logInfo } from "#lib/logs";
import { now } from "#lib/dates";
import { getLocalStoreItem, setLocalStoreItem } from "#browser/local-storage";
import type { ITask } from "../types";

export async function migrateTasks() {
  logInfo(`Migrating tasks...`);

  migrateV1();
  migrateV2();

  logInfo(`Migrated tasks.`);
}

function migrateV1() {
  const storedTasks = getLocalStoreItem<ITask[]>("todos", []);
  // remove `description` keys which are empty strings
  const legacyTasks = storedTasks.filter(
    ({ description, updated_at }) => description === "" || updated_at!,
  );

  if (!legacyTasks.length) {
    return;
  }

  logInfo(`Migrating ${legacyTasks.length} V1 legacy tasks...`);

  const updatedTasks = storedTasks.map<ITask>((currentTask) => {
    const legacyTask = legacyTasks.find(({ id }) => id === currentTask.id);

    if (!legacyTask) {
      return currentTask;
    }

    const description =
      legacyTask.description === "" ? undefined : legacyTask.description;
    const updated_at = !legacyTask.updated_at ? now() : legacyTask.updated_at;
    const updatedTask: ITask = { ...currentTask, description, updated_at };

    return updatedTask;
  });

  setLocalStoreItem("todos", updatedTasks);

  logInfo(`Migrated ${legacyTasks.length} V1 legacy tasks.`);
}

function migrateV2() {
  const storedTasks = getLocalStoreItem<ITask[]>("todos", []);

  const legacyTasks = storedTasks.filter(({ status }) => !status);

  if (!legacyTasks.length) {
    return;
  }

  logInfo(`Migrating ${legacyTasks.length} V2 legacy tasks...`);

  const updatedTasks = storedTasks.map<ITask>((currentTask) => {
    const legacyTask = legacyTasks.find(({ id }) => id === currentTask.id);

    if (!legacyTask) {
      return currentTask;
    }

    const updatedTask: ITask = { ...currentTask, status: "pending" };

    return updatedTask;
  });

  setLocalStoreItem("todos", updatedTasks);

  logInfo(`Migrated ${legacyTasks.length} V2 legacy tasks.`);
}
