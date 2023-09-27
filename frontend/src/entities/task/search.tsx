import { useState } from "react";
import type { ILocalization, ILocalizationCommon } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import { InputSectionSelect, InputSectionText } from "#components/form/section";
import { InputOption } from "#components/form/input";
import { ITask, isTaskStatus } from "./types";

import statusStyles from "./status.module.scss";

export interface ITaskSearchQuery {
  query?: string;
  status?: ITask["status"];
}

export interface ISearchTasksFormProps {
  id: string;
  commonTranslation: ILocalizationCommon;
  translation: ILocalization["todos"];
  statusTranslation: ILocalization["stats_tasks"]["status_values"];
  defaultQuery?: ITaskSearchQuery;
  onSearch: (newSearchQuery: ITaskSearchQuery) => Promise<void>;
}

export function SearchTasksForm({
  commonTranslation,
  translation,
  statusTranslation,
  id,
  defaultQuery,
  onSearch,
}: ISearchTasksFormProps) {
  const [oldQuery, changeOldQuery] = useState<ITaskSearchQuery | undefined>(
    defaultQuery,
  );
  const { query, search, searching } = translation.search_tasks;
  const { status } = translation;
  const FIELD = {
    QUERY: { name: "query", label: query },
    STATUS: { name: "status", label: status },
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

    if (oldQuery && query === oldQuery.query && status === oldQuery.status) {
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
      commonTranslation={commonTranslation}
      id={id}
      onSubmit={handleSubmit}
      submitButton={(_, isSubmitting) => (!isSubmitting ? search : searching)}
    >
      {(formID) => (
        <>
          <InputSectionText
            id={`${formID}-${FIELD.QUERY.name}`}
            form={formID}
            name={FIELD.QUERY.name}
            minLength={1}
            maxLength={32}
            defaultValue={defaultQuery?.query}
          >
            {FIELD.QUERY.label}
          </InputSectionText>

          <InputSectionSelect
            label={FIELD.STATUS.label}
            id={`${formID}-${FIELD.STATUS.name}`}
            form={formID}
            name={FIELD.STATUS.name}
          >
            <InputOption value="" selected={!defaultQuery?.status}>
              {statusTranslation.all}
            </InputOption>

            <InputOption
              className={statusStyles["in-progress"]}
              value="in-progress"
              selected={defaultQuery?.status === "in-progress"}
            >
              {statusTranslation["in-progress"]}
            </InputOption>

            <InputOption
              className={statusStyles.pending}
              value="pending"
              selected={defaultQuery?.status === "pending"}
            >
              {statusTranslation.pending}
            </InputOption>

            <InputOption
              className={statusStyles.finished}
              value="finished"
              selected={defaultQuery?.status === "finished"}
            >
              {statusTranslation.finished}
            </InputOption>

            <InputOption
              className={statusStyles.failed}
              value="failed"
              selected={defaultQuery?.status === "failed"}
            >
              {statusTranslation.failed}
            </InputOption>
          </InputSectionSelect>
        </>
      )}
    </Form>
  );
}
