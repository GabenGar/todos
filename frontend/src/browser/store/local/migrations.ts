import { logInfo } from "#lib/logs";
import { now } from "#lib/dates";
import type { ITaskStore } from "#entities/task";
import { getLocalStoreItem } from "./get";
import { setLocalStoreItem } from "./set";
import { LOCAL_STORAGE_KEYS } from "./types";

export async function runMigrations() {
  logInfo(`Migrating tasks...`);

  await migrateV1();
  await migrateV2();

  logInfo(`Migrated tasks.`);
}

async function migrateV1() {
  const storedTasks = getLocalStoreItem<ITaskStore[]>(
    LOCAL_STORAGE_KEYS.TODOS,
    [],
  );
  // remove `description` keys which are empty strings
  const legacyTasks = storedTasks.filter(
    ({ description, updated_at }) => description === "" || !updated_at,
  );

  if (!legacyTasks.length) {
    return;
  }

  logInfo(`Migrating ${legacyTasks.length} V1 legacy tasks...`);

  const updatedTasks = storedTasks.map<ITaskStore>((currentTask) => {
    const legacyTask = legacyTasks.find(({ id }) => id === currentTask.id);

    if (!legacyTask) {
      return currentTask;
    }

    const description =
      legacyTask.description === "" ? undefined : legacyTask.description;
    const updated_at = !legacyTask.updated_at ? now() : legacyTask.updated_at;
    const updatedTask: ITaskStore = { ...currentTask, description, updated_at };

    return updatedTask;
  });

  setLocalStoreItem("todos", updatedTasks);

  logInfo(`Migrated ${legacyTasks.length} V1 legacy tasks.`);
}

async function migrateV2() {
  const storedTasks = getLocalStoreItem<ITaskStore[]>(
    LOCAL_STORAGE_KEYS.TODOS,
    [],
  );

  const legacyTasks = storedTasks.filter(({ status }) => !status);

  if (!legacyTasks.length) {
    return;
  }

  logInfo(`Migrating ${legacyTasks.length} V2 legacy tasks...`);

  const updatedTasks = storedTasks.map<ITaskStore>((currentTask) => {
    const legacyTask = legacyTasks.find(({ id }) => id === currentTask.id);

    if (!legacyTask) {
      return currentTask;
    }

    const updatedTask: ITaskStore = { ...currentTask, status: "pending" };

    return updatedTask;
  });

  setLocalStoreItem("todos", updatedTasks);

  logInfo(`Migrated ${legacyTasks.length} V2 legacy tasks.`);
}
