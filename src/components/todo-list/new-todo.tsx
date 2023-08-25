import { Form, Label } from "#components/form";
import type { ITodoInit } from "./types";

import styles from "./new-todo.module.scss"

interface IProps {
  id: string;
  onNewTodo: (todoInit: ITodoInit) => Promise<void>;
}

export function NewTodoForm({ id, onNewTodo }: IProps) {
  return (
    <Form
      id={id}
      className={styles.block}
      onSubmit={async (event) => {
        const formElements = event.currentTarget.elements;
        const title = (formElements["title"] as HTMLInputElement).value.trim();
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

        await onNewTodo(init);
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
  );
}
