import { Form, type IFormEvent } from "#components/form";
import { InputOption } from "#components/form/input";
import { InputSectionSelect, InputSectionText } from "#components/form/section";
import type { ILocalizableProps } from "#components/types";
import { type IPlace, PlaceSection } from "#entities/place";
import { useTranslation } from "#hooks";
import { type ITaskInit, isTaskStatus } from "./types";
//

import styles from "./new.module.scss";
import statusStyles from "./status.module.scss";

export interface INewTaskFormProps extends ILocalizableProps {
  id: string;
  place?: IPlace;
  onNewTask: (taskInit: ITaskInit) => Promise<void>;
}

export function NewTaskForm({
  language,
  id,
  place,
  onNewTask,
}: INewTaskFormProps) {
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

    const init: ITaskInit = {
      title,
    };

    if (description.length) {
      init.description = description;
    }

    if (isTaskStatus(status)) {
      init.status = status;
    }

    if (place_id.length) {
      init.place_id = place_id;
    }

    await onNewTask(init);
  }

  return (
    <Form<IFieldName>
      id={id}
      className={styles.block}
      onSubmit={handleSubmit}
      submitButton={(_formID, isSubmitting) =>
        t((t) => (!isSubmitting ? t.task.new_todo.add : t.task.new_todo.adding))
      }
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
            rows={4}
          >
            {FIELD.DESCRIPTION.label}
          </InputSectionText>

          <PlaceSection
            // a dirty hack to force update on the component state
            key={place?.id}
            language={language}
            id={`${formID}-${FIELD.PLACE.name}`}
            form={formID}
            name={FIELD.PLACE.name}
            place={place}
          >
            {FIELD.PLACE.label}
          </PlaceSection>

          <InputSectionSelect
            label={FIELD.STATUS.label}
            id={`${formID}-${FIELD.STATUS.name}`}
            form={formID}
            name={FIELD.STATUS.name}
            defaultValue="pending"
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
