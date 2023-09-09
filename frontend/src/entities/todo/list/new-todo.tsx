import {
  Form,
  Label,
  type IFormElements,
  type IFormEvent,
} from "#components/form";
import { ButtonSubmit } from "#components/button";
import type { ITodoInit } from "../types";

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
  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();

    if (!title) {
      return;
    }

    const init: ITodoInit = {
      title,
      description: !description ? undefined : description,
    };

    console.log(description, init);

    await onNewTodo(init);
  }

  return (
    <Form id={id} className={styles.block} onSubmit={handleSubmit}>
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
              maxLength={256}
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
              maxLength={2048}
            />
          </div>

          <ButtonSubmit form={formID} viewType="button">
            Add
          </ButtonSubmit>
        </>
      )}
    </Form>
  );
}
