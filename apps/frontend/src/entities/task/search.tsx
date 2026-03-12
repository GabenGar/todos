import { useState } from "react";
import { Form, type IFormEvent } from "#components/form";
import { InputOption } from "#components/form/input";
import { InputSectionSelect, InputSectionText } from "#components/form/section";
import type { ILocalizableProps } from "#components/types";
import { type IPlace, PlaceSection } from "#entities/place";
import { useTranslation } from "#hooks";
import { type ITask, isTaskStatus } from "./types";
//

import statusStyles from "./status.module.scss";

export interface ITaskSearchQuery {
  query?: string;
  status?: ITask["status"];
  place_id?: IPlace["id"];
}

export interface ISearchTasksFormProps extends ILocalizableProps {
  id: string;
  defaultQuery?: ITaskSearchQuery;
  onSearch: (newSearchQuery: ITaskSearchQuery) => Promise<void>;
  place?: IPlace;
}

export function SearchTasksForm({
  language,
  id,
  defaultQuery,
  place,
  onSearch,
}: ISearchTasksFormProps) {
  const { t } = useTranslation("translation");
  const [oldQuery, changeOldQuery] = useState<ITaskSearchQuery | undefined>(
    defaultQuery,
  );
  const FIELD = {
    QUERY: { name: "query", label: t((t) => t.task.search_tasks.query) },
    PLACE: { name: "place_id", label: t((t) => t.task.search_tasks["Place"]) },
    STATUS: { name: "status", label: t((t) => t.task.status) },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const query = formElements.query.value.trim();
    const inputStatus = formElements.status.value.trim();
    const status =
      inputStatus === "" || !isTaskStatus(inputStatus)
        ? undefined
        : inputStatus;
    const place_id = formElements.place_id.value.trim();

    if (
      oldQuery &&
      query === oldQuery.query &&
      status === oldQuery.status &&
      place_id === oldQuery.place_id
    ) {
      return;
    }

    const newSearchQuery: ITaskSearchQuery = {
      query,
      status,
    };

    changeOldQuery(newSearchQuery);
    await onSearch(newSearchQuery);
  }

  return (
    <Form<IFieldName>
      id={id}
      onSubmit={handleSubmit}
      submitButton={(_, isSubmitting) =>
        t((t) =>
          !isSubmitting
            ? t.task.search_tasks.search
            : t.task.search_tasks.searching,
        )
      }
    >
      {(formID) => (
        <>
          <InputSectionText
            id={`${formID}-${FIELD.QUERY.name}`}
            form={formID}
            name={FIELD.QUERY.name}
            minLength={1}
            maxLength={20}
            defaultValue={defaultQuery?.query}
          >
            {FIELD.QUERY.label}
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
            defaultValue={defaultQuery?.status ?? ""}
          >
            <InputOption value="">
              {t((t) => t.task.status_values.all)}
            </InputOption>

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
