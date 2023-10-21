import type { ILocalization } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import {
  InputSectionNanoID,
  InputSectionSelect,
  InputSectionText,
} from "#components/form/section";
import type { ITranslatableProps } from "#components/types";
import { InputOption } from "#components/form/input";
import { isTaskStatus, type ITask, type ITaskUpdate } from "./types";

import statusStyles from "./status.module.scss";

export interface IEditTaskFormProps extends ITranslatableProps {
  translation: ILocalization["todos"];
  id: string;
  currentTask: ITask;
  onTaskEdit: (taskUpdate: ITaskUpdate) => Promise<void>;
}

export function EditTaskForm({
  commonTranslation,
  translation,
  currentTask,
  id,
  onTaskEdit,
}: IEditTaskFormProps) {
  const { title, description, status, place } = translation.new_todo;
  const { status_values, editing, edit } = translation;
  const FIELD = {
    TITLE: { name: "title", label: title },
    DESCRIPTION: { name: "description", label: description },
    STATUS: { name: "status", label: status },
    PLACE: { name: "place_id", label: place },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();
    const status = formElements.status.value.trim();
    const place_id = formElements.place_id.value.trim();

    const update: ITaskUpdate = {
      id: currentTask.id,
    };

    if (!title && !description && !status) {
      return;
    }

    if (title && title !== currentTask.title) {
      update.title = title;
    }

    if (description && description !== currentTask.description) {
      update.description = description;
    }

    if (isTaskStatus(status) && status !== currentTask.status) {
      update.status = status;
    }

    if (place_id && place_id !== currentTask.place?.id) {
      update.place_id = place_id;
    }

    await onTaskEdit(update);
  }

  return (
    <Form
      commonTranslation={commonTranslation}
      id={id}
      submitButton={(formID, isSubmitting) => (!isSubmitting ? edit : editing)}
      onSubmit={handleSubmit}
    >
      {(formID) => (
        <>
          <InputSectionText
            id={`${formID}-${FIELD.TITLE.name}`}
            form={formID}
            name={FIELD.TITLE.name}
            minLength={1}
            maxLength={256}
            rows={2}
            defaultValue={currentTask.title}
          >
            {FIELD.TITLE.label}
          </InputSectionText>

          <InputSectionText
            id={`${formID}-${FIELD.DESCRIPTION.name}`}
            form={formID}
            name={FIELD.DESCRIPTION.name}
            minLength={1}
            maxLength={2048}
            rows={4}
            defaultValue={currentTask.description}
          >
            {FIELD.DESCRIPTION.label}
          </InputSectionText>

          <InputSectionNanoID
            id={`${formID}-${FIELD.PLACE.name}`}
            form={formID}
            name={FIELD.PLACE.name}
            defaultValue={currentTask.place?.id}
          >
            {FIELD.PLACE.label}
          </InputSectionNanoID>

          <InputSectionSelect
            label={FIELD.STATUS.label}
            id={`${formID}-${FIELD.STATUS.name}`}
            form={formID}
            name={FIELD.STATUS.name}
          >
            <InputOption
              className={statusStyles["in-progress"]}
              value="in-progress"
              selected={currentTask.status === "in-progress"}
            >
              {status_values["in-progress"]}
            </InputOption>

            <InputOption
              className={statusStyles.pending}
              value="pending"
              selected={currentTask.status === "pending"}
            >
              {status_values.pending}
            </InputOption>

            <InputOption
              className={statusStyles.finished}
              value="finished"
              selected={currentTask.status === "finished"}
            >
              {status_values.finished}
            </InputOption>

            <InputOption
              className={statusStyles.failed}
              value="failed"
              selected={currentTask.status === "failed"}
            >
              {status_values.failed}
            </InputOption>
          </InputSectionSelect>
        </>
      )}
    </Form>
  );
}
