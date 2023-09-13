import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { logDebug, logInfo } from "#lib/logs";
import { getLocalStoreItem, setLocalStoreItem } from "#browser/local-storage";
import type { ITodo, ITodoInit, ITodoUpdate } from "./types";

let isMigrated = false;

export async function migrateTasks() {
  logInfo(`Migrating tasks...`);

  const storedTasks = getLocalStoreItem<ITodo[]>("todos", []);
  // remove `description` keys which are empty strings
  const legacyTasks = storedTasks.filter(
    ({ description }) => description === "",
  );

  if (!legacyTasks.length) {
    isMigrated = true;
    logInfo(`Migrated tasks.`);

    return;
  }

  logInfo(`Migrating ${legacyTasks.length} legacy tasks...`);
  const updatedTasks = storedTasks.map<ITodo>((currentTask) => {
    const legacyTask = legacyTasks.find(({ id }) => id === currentTask.id);

    if (!legacyTask) {
      return currentTask;
    }

    const updatedTask: ITodo = { ...currentTask, description: undefined };

    return updatedTask;
  });

  setLocalStoreItem("todos", updatedTasks);

  isMigrated = true;

  logInfo(`Migrated ${legacyTasks.length} legacy tasks.`);
}

export async function getTodos(): Promise<ITodo[]> {
  logDebug(`Getting tasks...`);

  if (!isMigrated) {
    await migrateTasks();
  }

  const storedTodos = getLocalStoreItem<ITodo[]>("todos", []);

  logDebug(`Got ${storedTodos.length} tasks.`);

  return storedTodos;
}

export async function createTodo(init: ITodoInit): Promise<ITodo> {
  const [newTodo] = await createTodos([init]);

  return newTodo;
}

/**
 * @param inits
 * @returns Added todos.
 */
async function createTodos(inits: ITodoInit[]): Promise<ITodo[]> {
  logDebug(`Creating ${inits.length} tasks...`);

  const incomingTodos = inits.map(({ title, description }) => {
    const newTodo: ITodo = {
      id: nanoid(),
      title,
      description,
      created_at: now(),
      updated_at: now(),
    };

    return newTodo;
  });

  const currentTodos = await getTodos();

  const newTodos = [...currentTodos, ...incomingTodos];
  setLocalStoreItem("todos", newTodos);

  logDebug(`Created ${inits.length} tasks.`);

  return incomingTodos;
}

export async function editTodo(update: ITodoUpdate): Promise<ITodo> {
  const [editedTodo] = await editTodos([update]);

  return editedTodo;
}

/**
 * @param updates Incoming updates. It it assumed they have unique ids.
 * @returns The edited Todos.
 */
async function editTodos(updates: ITodoUpdate[]): Promise<ITodo[]> {
  logDebug(`Editing ${updates.length} tasks...`);

  const storedTodos = await getTodos();
  const updateIDs = new Set(updates.map(({ id }) => id));

  if (updateIDs.size !== updates.length) {
    throw new Error(
      `The amount of IDs (${updateIDs.size}) does not match the amount of updates (${updates.length}).`,
    );
  }

  const todosWithUpdatedApplied = storedTodos.map<ITodo>((todo) => {
    if (!updateIDs.has(todo.id)) {
      return todo;
    }

    // non-updates are filtered beforehand
    const update = updates.find(({ id }) => id === todo.id)!;
    const updatedTodo: ITodo = {
      ...todo,
      updated_at: now(),
      title: todo.title !== update.title ? update.title : todo.title,
      description:
        todo.description !== update.description
          ? update.description
          : todo.description,
    };

    return updatedTodo;
  });

  setLocalStoreItem("todos", todosWithUpdatedApplied);

  const editedTodos = todosWithUpdatedApplied.filter(({ id }) =>
    updateIDs.has(id),
  );

  logDebug(`Edited ${editedTodos.length} tasks.`);

  return editedTodos;
}

export async function removeTodo(id: ITodo["id"]): Promise<ITodo> {
  const [removedTodo] = await removeTodos([id]);

  return removedTodo;
}

/**
 * @param ids IDs of removed todos. Must be unique.
 * @returns The removed Todos
 */
async function removeTodos(ids: ITodo["id"][]): Promise<ITodo[]> {
  logDebug(`Removing ${ids.length} tasks...`);

  const removedIDs = new Set(ids);

  if (removedIDs.size !== ids.length) {
    throw new Error(
      `The amount of IDs (${removedIDs.size}) does not match the amount of removals (${ids.length}).`,
    );
  }

  const storedTodos = await getTodos();
  const filteredTodos = storedTodos.filter(({ id }) => !removedIDs.has(id));

  setLocalStoreItem("todos", filteredTodos);

  const removedTodos = storedTodos.filter(({ id }) => removedIDs.has(id));

  logDebug(`Removed ${removedTodos.length} tasks.`);

  return removedTodos;
}
