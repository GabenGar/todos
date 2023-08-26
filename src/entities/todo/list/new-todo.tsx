import { Form, Label, type IFormElements } from "#components/form";
import { ButtonSubmit } from "#components/button";
import type { ITodoInit } from "./types";

import styles from "./new-todo.module.scss";

interface IProps {
  id: string;
  onNewTodo: (todoInit: ITodoInit) => Promise<void>;
}

const FIELD = {
  TITLE: { name: "title", label: "Title" },
  DESCRIPTION: { name: "description", label: "Description" },
} as const;
type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

export function NewTodoForm({ id, onNewTodo }: IProps) {
  return (
    <Form
      id={id}
      className={styles.block}
      onSubmit={async (event) => {
        const formElements = event.currentTarget
          .elements as IFormElements<IFieldName>;
        const title = formElements.title.value.trim();
        const description = formElements.description.value.trim();

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
            <Label htmlFor={`${formID}-${FIELD.TITLE.name}`}>
              {FIELD.TITLE.label}
            </Label>
            <input
              form={formID}
              type="text"
              name={FIELD.TITLE.name}
              id={`${formID}-${FIELD.TITLE.name}`}
              minLength={1}
              maxLength={128}
              required
            />
          </div>

          <div>
            <Label htmlFor={`${formID}-${FIELD.DESCRIPTION.name}`}>
              {FIELD.DESCRIPTION.label}
            </Label>
            <input
              form={formID}
              type="text"
              name={FIELD.DESCRIPTION.name}
              id={`${formID}-${FIELD.DESCRIPTION.name}`}
              minLength={1}
              maxLength={512}
            />
          </div>

          <ButtonSubmit form={formID} viewType="button">Add</ButtonSubmit>
        </>
      )}
    </Form>
  );
}
