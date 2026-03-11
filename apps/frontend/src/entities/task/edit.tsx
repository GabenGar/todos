import { Form, type IFormEvent } from "#components/form";
import { InputOption } from "#components/form/input";
import { InputSectionSelect, InputSectionText } from "#components/form/section";
import type { ILocalizableProps } from "#components/types";
import { PlaceSection } from "#entities/place";
import { useTranslation } from "#hooks";
import { type ITask, type ITaskUpdate, isTaskStatus } from "./types";
//

import statusStyles from "./status.module.scss";

export interface IEditTaskFormProps extends ILocalizableProps {
  id: string;
  currentTask: ITask;
  onTaskEdit: (taskUpdate: ITaskUpdate) => Promise<void>;
}

export function EditTaskForm({
  language,
  id,
  currentTask,
  onTaskEdit,
}: IEditTaskFormProps) {
  const { t } = useTranslation("translation");

  const FIELD = {
    TITLE: { name: "title", label: t((t) => t.task.new_todo.title) },
    DESCRIPTION: {
      name: "description",
      label: t((t) => t.task.new_todo.description),
    },
    STATUS: { name: "status", label: t((t) => t.task.new_todo.status) },
    PLACE: { name: "place_id", label: t((t) => t.task.new_todo.place) },
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
      id={id}
      submitButton={(_formID, isSubmitting) =>
        t((t) => (!isSubmitting ? t.task.edit : t.task.editing))
      }
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
            language={language}
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
              {t((t) => t.task.status_values["in-progress"])}
            </InputOption>

            <InputOption className={statusStyles.pending} value="pending">
              {t((t) => t.task.status_values.pending)}
            </InputOption>

            <InputOption className={statusStyles.finished} value="finished">
              {t((t) => t.task.status_values.finished)}
            </InputOption>

            <InputOption className={statusStyles.failed} value="failed">
              {t((t) => t.task.status_values.failed)}
            </InputOption>
          </InputSectionSelect>
        </>
      )}
    </Form>
  );
}
