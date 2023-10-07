import { logDebug } from "#lib/logs";
import { IPaginatedCollection, createPagination } from "#lib/pagination";
import { isSubstring } from "#lib/strings";
import { getLocalStoreItem } from "#browser/local-storage";
import { migrateTasks } from "./migrate";
import type { ITask, ITaskStatsAll } from "../types";

interface IOptions {
  includeDeleted?: boolean;
  page?: number;
  query?: string;
  status?: ITask["status"];
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

export async function getTasksStats(): Promise<ITaskStatsAll> {
  const currentTasks = await getAllTasks();
  const initStats: ITaskStatsAll = {
    all: 0,
    finished: 0,
    "in-progress": 0,
    failed: 0,
    pending: 0,
  };
  const stats = currentTasks.reduce<ITaskStatsAll>((stats, task) => {
    stats.all = stats.all + 1;

    if (!task.deleted_at) {
      stats[task.status] = stats[task.status] + 1;
    }

    return stats;
  }, initStats);

  return stats;
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

  const { includeDeleted, page, query, status: searchStatus } = options;
  const storedTasks = await getAllTasks();
  const filteredTasks = storedTasks.filter(
    ({ deleted_at, title, description, status }) => {
      const isDeletedIncluded = includeDeleted ? true : !deleted_at;

      if (!isDeletedIncluded) {
        return false;
      }

      const isMatchingQuery = !query
        ? true
        : isSubstring(query, title) || isSubstring(query, description);

      const isMatchingStatus = !searchStatus ? true : status === searchStatus;
      const isIncluded =
        isDeletedIncluded && isMatchingQuery && isMatchingStatus;

      return isIncluded;
    },
  );
  const pagination = createPagination(filteredTasks.length, page);
  const items = filteredTasks.slice(
    pagination.offset,
    pagination.currentMax,
  );
  const collection: IPaginatedCollection<ITask> = {
    pagination,
    items,
  };

  logDebug(`Got ${items.length} tasks.`);

  return collection;
}
