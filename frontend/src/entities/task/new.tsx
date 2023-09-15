import type { ILocalization } from "#lib/localization";
import { Form, Label, type IFormEvent } from "#components/form";
import { ButtonSubmit } from "#components/button";
import type { ITaskInit } from "./types";

import styles from "./new.module.scss";

interface IProps {
  translation: ILocalization["todos"]["new_todo"];
  id: string;
  onNewTask: (taskInit: ITaskInit) => Promise<void>;
}

export function NewTaskForm({ translation, id, onNewTask }: IProps) {
  const { title, description, add } = translation;
  const FIELD = {
    TITLE: { name: "title", label: title },
    DESCRIPTION: { name: "description", label: description },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();

    if (!title) {
      return;
    }

    const init: ITaskInit = {
      title,
      description: !description ? undefined : description,
    };

    await onNewTask(init);
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
            {add}
          </ButtonSubmit>
        </>
      )}
    </Form>
  );
}
