import { useState } from "react";
import { nanoid } from "nanoid";
import type {
  IBaseComponentPropsWithChildren,
  IBaseComponentProps,
} from "#components/types";
import { NewTodoForm } from "./new-todo-form";
import type { ITodo, ITodoInit } from "./types";

interface ITodoListProps extends IBaseComponentProps<"div"> {
  id: string;
  onUpdate?: (newTodos: ITodo[]) => Promise<void>;
}

interface ITodoItemProps extends IBaseComponentPropsWithChildren<"li"> {
  todo: ITodo;
}

export function TodoList({ id, onUpdate, ...props }: ITodoListProps) {
  const [todos, changeTodos] = useState<ITodo[]>([]);
  const todoListID = `${id}-todolist`;

  async function addTodo({ title, description }: ITodoInit) {
    const newTodo: ITodo = {
      id: nanoid(),
      title,
      description,
      created_at: new Date(),
    };

    const newTodos = [...todos, newTodo];
    onUpdate?.(newTodos);
    changeTodos(newTodos);
  }

  return (
    <div {...props}>
      <NewTodoForm id={todoListID} onNewTodo={addTodo}/>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

function TodoItem({ todo, ...props }: ITodoItemProps) {
  const { id, created_at, title, description } = todo;

  return (
    <li {...props}>
      {created_at.toISOString()}
      <br />
      {title}
      <br />
      {description}
    </li>
  );
}
