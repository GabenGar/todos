import { logDebug } from "#lib/logs";
import { IPaginatedCollection, createPagination } from "#lib/pagination";
import { getLocalStoreItem } from "#browser/local-storage";
import { migrateTasks } from "./migrate";
import type { ITask } from "../types";

interface IOptions {
  includeDeleted?: boolean;
  page?: number;
}

let isMigrated = false;

const defaultOptions = {
  includeDeleted: false,
} as const satisfies IOptions;

export async function getTask(taskID: ITask["id"]) {
  if (!isMigrated) {
    try {
      await migrateTasks();
    } finally {
      isMigrated = true;
    }
  }

  const storedTasks = getLocalStoreItem<ITask[]>("todos", []);
  const task = storedTasks.find(({ id }) => id === taskID);

  if (!task) {
    throw new Error(`No task with ID "${taskID}" exists.`);
  }

  return task;
}

/**
 * @TODO validation
 */
export async function getTasks(
  options: IOptions = defaultOptions,
): Promise<IPaginatedCollection<ITask>> {
  logDebug(`Getting tasks...`);

  if (!isMigrated) {
    try {
      await migrateTasks();
    } finally {
      isMigrated = true;
    }
  }

  const { includeDeleted, page } = options;
  const storedTasks = getLocalStoreItem<ITask[]>("todos", []);
  const filteredTasks = storedTasks.filter(({ deleted_at }) =>
    includeDeleted ? true : !deleted_at,
  );
  const pagination = createPagination(filteredTasks.length, page);
  const items = filteredTasks.slice(
    pagination.offset,
    pagination.currentMax + 1,
  );
  const collection: IPaginatedCollection<ITask> = {
    pagination,
    items,
  };

  logDebug(`Got ${items.length} tasks.`);

  return collection;
}
