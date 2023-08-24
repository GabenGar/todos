import { useState } from "react";
import { nanoid } from "nanoid";
import { Form } from "./forms";
import {
  type IBaseComponentPropsWithChildren,
  type IBaseComponentProps,
} from "./types";

interface ITodoListProps extends IBaseComponentProps<"div"> {
  id: string;
}

interface ITodoItemProps extends IBaseComponentPropsWithChildren<"li"> {
  todo: ITodo;
}

interface ITodo {
  id: string;
  created_at: Date;
  content: string;
}

export function TodoList({ id, ...props }: ITodoListProps) {
  const [todos, changeTodos] = useState<ITodo[]>([]);
  const todoListID = `${id}-todolist`;

  return (
    <div {...props}>
      <Form
        id={todoListID}
        onSubmit={async (event) => {
          const formElements = event.currentTarget.elements;
          const content = (
            formElements["content"] as HTMLInputElement
          ).value.trim();

          if (!content) {
            return;
          }

          const newTodo: ITodo = {
            id: nanoid(),
            content,
            created_at: new Date(),
          };

          const newTodos = [...todos, newTodo];
          changeTodos(newTodos);
        }}
      >
        {(formID) => (
          <>
            <input
              form={formID}
              type="text"
              name="content"
              id={`${formID}-content`}
              minLength={1}
              maxLength={256}
            />
            <button form={formID} type="submit">
              Add
            </button>
          </>
        )}
      </Form>
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

function TodoItem({ todo, ...props }: ITodoItemProps) {
  const { id, created_at, content } = todo;

  return (
    <li {...props}>
      {created_at.toISOString()}
      <br />
      {content}
    </li>
  );
}
