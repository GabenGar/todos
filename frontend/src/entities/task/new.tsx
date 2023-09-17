import type { ILocalization } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import { ButtonSubmit } from "#components/button";
import { InputSectionText } from "#components/form/section";
import type { ITaskInit } from "./types";

import styles from "./new.module.scss";

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
          <InputSectionText
            id={`${formID}-${FIELD.TITLE.name}`}
            form={formID}
            name={FIELD.TITLE.name}
            minLength={1}
            maxLength={256}
            required
          >
            {FIELD.TITLE.label}
          </InputSectionText>

          <InputSectionText
            id={`${formID}-${FIELD.DESCRIPTION.name}`}
            form={formID}
            name={FIELD.DESCRIPTION.name}
            minLength={1}
            maxLength={2048}
            required
          >
            {FIELD.DESCRIPTION.label}
          </InputSectionText>

          <ButtonSubmit form={formID} viewType="button">
            {add}
          </ButtonSubmit>
        </>
      )}
    </Form>
  );
}
