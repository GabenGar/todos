import { createValidator } from "#lib/json/schema";
import { createLocalStorage } from "#store/local";
import type { ITaskStore } from "../types";

const validateTask = createValidator<ITaskStore>("/entities/task/entity");

function validateTasksKey(input: unknown): asserts input is ITaskStore[] {
  if (!Array.isArray(input)) {
    throw new Error(`The value of "todos" is not an array.`);
  }

  input.forEach((value) => validateTask(value));
}

const { get, set } = createLocalStorage("todos", [], validateTasksKey);

export const getLocalStoreTasks = get;
export const setLocalStoreTasks = set;
