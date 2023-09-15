import type { ILocalization } from "#lib/localization";
import { Form, Label, type IFormEvent } from "#components/form";
import { ButtonSubmit } from "#components/button";
import type { ITaskInit } from "./types";

import styles from "./new.module.scss";
import { logMessage } from "#lib/logs";
import { toJSON } from "#lib/json";

interface IProps {
  translation: ILocalization["todos"]["new_todo"];
  id: string;
  onNewTask: (taskInit: ITaskInit) => Promise<void>;
}

/**
 * @TODO status selector
 */
export function NewTaskForm({ translation, id, onNewTask }: IProps) {
  const { title, description, add, status } = translation;
  const FIELD = {
    TITLE: { name: "title", label: title },
    DESCRIPTION: { name: "description", label: description },
    // STATUS: { name: "status", label: status  }
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();

    const init: ITaskInit = {
      title,
    };

    if (description.length) {
      init.description = description;
    }

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
