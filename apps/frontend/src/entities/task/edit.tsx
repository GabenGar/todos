import type { ILocalization } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import {
  InputSectionNanoID,
  InputSectionSelect,
  InputSectionText,
} from "#components/form/section";
import type { ITranslatableProps } from "#components/types";
import { InputOption } from "#components/form/input";
import { PlaceSection } from "#entities/place";
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
  id,
  currentTask,
  onTaskEdit,
}: IEditTaskFormProps) {
  const {
    title,
    description,
    status,
    place: placeTranslation,
  } = translation.new_todo;
  const { status_values, editing, edit } = translation;
  const FIELD = {
    TITLE: { name: "title", label: title },
    DESCRIPTION: { name: "description", label: description },
    STATUS: { name: "status", label: status },
    PLACE: { name: "place_id", label: placeTranslation },
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

          <PlaceSection
            key={currentTask.place?.id}
            commonTranslation={commonTranslation}
            id={`${formID}-${FIELD.PLACE.name}`}
            form={formID}
            name={FIELD.PLACE.name}
            place={currentTask.place}
          >
            {FIELD.PLACE.label}
          </PlaceSection>

          <InputSectionSelect
            label={FIELD.STATUS.label}
            id={`${formID}-${FIELD.STATUS.name}`}
            form={formID}
            name={FIELD.STATUS.name}
            // @TODO fix a stale value being default after update
            // despite other fields updating instantly.
            defaultValue={currentTask.status}
          >
            <InputOption
              className={statusStyles["in-progress"]}
              value="in-progress"
            >
              {status_values["in-progress"]}
            </InputOption>

            <InputOption className={statusStyles.pending} value="pending">
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
