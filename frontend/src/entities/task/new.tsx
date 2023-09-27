import type { ILocalization, ILocalizationCommon } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import { InputOption } from "#components/form/input";
import { InputSectionSelect, InputSectionText } from "#components/form/section";
import { type ITaskInit, isTaskStatus } from "./types";

import styles from "./new.module.scss";
import statusStyles from "./status.module.scss";

export interface INewTaskFormProps {
  commonTranslation: ILocalizationCommon;
  translation: ILocalization["todos"];
  id: string;
  onNewTask: (taskInit: ITaskInit) => Promise<void>;
}

export function NewTaskForm({
  commonTranslation,
  translation,
  id,
  onNewTask,
}: INewTaskFormProps) {
  const { title, description, add, adding, status } = translation.new_todo;
  const { status_values } = translation;
  const FIELD = {
    TITLE: { name: "title", label: title },
    DESCRIPTION: { name: "description", label: description },
    STATUS: { name: "status", label: status },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();
    const status = formElements.status.value.trim();

    const init: ITaskInit = {
      title,
    };

    if (description.length) {
      init.description = description;
    }

    if (isTaskStatus(status)) {
      init.status = status;
    }

    await onNewTask(init);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      className={styles.block}
      onSubmit={handleSubmit}
      submitButton={(formID, isSubmitting) => (!isSubmitting ? add : adding)}
    >
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
          >
            {FIELD.DESCRIPTION.label}
          </InputSectionText>

          <InputSectionSelect
            label={FIELD.STATUS.label}
            id={`${formID}-${FIELD.STATUS.name}`}
            form={formID}
            name={FIELD.STATUS.name}
          >
            <InputOption
              className={statusStyles["in-progress"]}
              value="in-progress"
            >
              {status_values["in-progress"]}
            </InputOption>

            <InputOption
              className={statusStyles.pending}
              value="pending"
              selected
            >
              {status_values.pending}
            </InputOption>

            <InputOption className={statusStyles.finished} value="finished">
              {status_values.finished}
            </InputOption>

            <InputOption className={statusStyles.failed} value="failed">
              {status_values.failed}
            </InputOption>
          </InputSectionSelect>
        </>
      )}
    </Form>
  );
}
