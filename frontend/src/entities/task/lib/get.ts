import { logDebug } from "#lib/logs";
import { IPaginatedCollection, createPagination } from "#lib/pagination";
import { getLocalStoreItem } from "#browser/local-storage";
import { migrateTasks } from "./migrate";
import type { ITask } from "../types";
import { isSubstring } from "#lib/strings";

interface IOptions {
  includeDeleted?: boolean;
  page?: number;
  query?: string;
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

  const storedTasks = await getAllTasks();
  const task = storedTasks.find(({ id }) => id === taskID);

  if (!task) {
    throw new Error(`No task with ID "${taskID}" exists.`);
  }

  return task;
}

/**
 * @TODO derive its logic from `getTasks()` instead
 */
export async function getAllTasks(includeDeleted = true) {
  const storedTasks = getLocalStoreItem<ITask[]>("todos", []);
  const fitleredTasks = includeDeleted
    ? storedTasks
    : storedTasks.filter(({ deleted_at }) => !deleted_at);

  return fitleredTasks;
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

  const { includeDeleted, page, query } = options;
  const storedTasks = await getAllTasks();
  const filteredTasks = storedTasks.filter(
    ({ deleted_at, title, description }) => {
      const isDeletedIncluded = includeDeleted ? true : !deleted_at;

      if (!isDeletedIncluded) {
        return false;
      }

      const isMatchingQuery = !query
        ? true
        : isSubstring(query, title) || isSubstring(query, description);

      return isDeletedIncluded && isMatchingQuery;
    },
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
