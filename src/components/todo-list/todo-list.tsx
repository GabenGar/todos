import { useState } from "react";
import { nanoid } from "nanoid";
import { Form, Label } from "#components/forms";
import type {
  IBaseComponentPropsWithChildren,
  IBaseComponentProps,
} from "#components/types";
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
      <Form
        id={todoListID}
        onSubmit={async (event) => {
          const formElements = event.currentTarget.elements;
          const title = (
            formElements["title"] as HTMLInputElement
          ).value.trim();
          const description = (
            formElements["description"] as HTMLInputElement
          ).value.trim();

          if (!title) {
            return;
          }
          const init: ITodoInit = {
            title,
            description,
          };

          await addTodo(init);
        }}
      >
        {(formID) => (
          <>
            <div>
              <Label htmlFor={`${formID}-title`}>Title</Label>
              <input
                form={formID}
                type="text"
                name="title"
                id={`${formID}-title`}
                minLength={1}
                maxLength={256}
                required
              />
            </div>
            <div>
              <Label htmlFor={`${formID}-description`}>Description</Label>
              <input
                form={formID}
                type="text"
                name="description"
                id={`${formID}-description`}
                minLength={1}
                maxLength={512}
              />
            </div>

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
