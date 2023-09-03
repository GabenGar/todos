import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { getLocalStoreItem, setLocalStoreItem } from "#browser/local-storage";
import type { ITodo, ITodoInit, ITodoUpdate } from "./types";

export async function getTodos(): Promise<ITodo[]> {
  const storedTodos = getLocalStoreItem<ITodo[]>("todos", []);

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

  return removedTodos;
}
