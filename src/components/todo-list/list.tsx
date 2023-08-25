import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import { getLocalStoreItem, setLocalStoreItem } from "#browser/local-storage";
import type { IBaseComponentProps } from "#components/types";
import { Loading } from "components/loading";
import { NewTodoForm } from "./new-todo";
import { TodoItem } from "./item";
import type { ITodo, ITodoInit } from "./types";

import styles from "./list.module.scss";

interface ITodoListProps extends IBaseComponentProps<"div"> {
  id: string;
  onUpdate?: (newTodos: ITodo[]) => Promise<void>;
}

export function TodoList({ id, onUpdate, ...props }: ITodoListProps) {
  const [todos, changeTodos] = useState<ITodo[]>();
  const todoListID = `${id}-todolist`;

  useEffect(() => {
    if (todos) {
      return;
    }

    const storedTodos = getLocalStoreItem<ITodo[]>("todos", []);
    changeTodos(storedTodos);
  }, [todos]);

  async function addTodo({ title, description }: ITodoInit) {
    if (!todos) {
      return;
    }

    const newTodo: ITodo = {
      id: nanoid(),
      title,
      description,
      created_at: now(),
    };

    const newTodos = [...todos, newTodo];
    onUpdate?.(newTodos);
    changeTodos(newTodos);
    setLocalStoreItem("todos", newTodos);
  }

  async function removeTodo(removedID: ITodo["id"]) {
    if (!todos) {
      return;
    }

    const newTodos = todos.filter(({ id }) => id !== removedID);
    onUpdate?.(newTodos);
    changeTodos(newTodos);
    setLocalStoreItem("todos", newTodos);
  }

  return (
    <div {...props}>
      <NewTodoForm id={todoListID} onNewTodo={addTodo} />
      <ul className={styles.list}>
        {todos?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onRemoval={removeTodo} />
        )) ?? <Loading />}
      </ul>
    </div>
  );
}
