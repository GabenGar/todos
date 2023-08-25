import { useState } from "react";
import { nanoid } from "nanoid";
import { now } from "#lib/dates";
import type { IBaseComponentProps } from "#components/types";
import { NewTodoForm } from "./new-todo";
import { TodoItem } from "./item";
import type { ITodo, ITodoInit } from "./types";

import styles from "./list.module.scss";

interface ITodoListProps extends IBaseComponentProps<"div"> {
  id: string;
  onUpdate?: (newTodos: ITodo[]) => Promise<void>;
}

export function TodoList({ id, onUpdate, ...props }: ITodoListProps) {
  const [todos, changeTodos] = useState<ITodo[]>([]);
  const todoListID = `${id}-todolist`;

  async function addTodo({ title, description }: ITodoInit) {
    const newTodo: ITodo = {
      id: nanoid(),
      title,
      description,
      created_at: now(),
    };

    const newTodos = [...todos, newTodo];
    onUpdate?.(newTodos);
    changeTodos(newTodos);
  }

  async function removeTodo(removedID: ITodo["id"]) {
    const newTodos = todos.filter(({ id }) => id !== removedID);
    onUpdate?.(newTodos);
    changeTodos(newTodos);
  }

  return (
    <div {...props}>
      <NewTodoForm id={todoListID} onNewTodo={addTodo} />
      <ul className={styles.list}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onRemoval={removeTodo} />
        ))}
      </ul>
    </div>
  );
}
