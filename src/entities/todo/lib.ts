import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { getLocalStoreItem, setLocalStoreItem } from "#browser/local-storage";
import type { ITodo, ITodoInit } from "./types";

export async function getTodos() {
  const storedTodos = getLocalStoreItem<ITodo[]>("todos", []);

  return storedTodos;
}

export async function createTodo(init: ITodoInit) {}

/**
 * @param inits
 * @returns Added todos.
 */
export async function createTodos(inits: ITodoInit[]) {
  const incomingTodos = inits.map(({ title, description }) => {
    const newTodo: ITodo = {
      id: nanoid(),
      title,
      description,
      created_at: now(),
    };

    return newTodo;
  });

  const currentTodos = await getTodos();

  const newTodos = [...currentTodos, ...incomingTodos];
  setLocalStoreItem("todos", newTodos);

  return incomingTodos;
}

export async function updateTodos() {}
