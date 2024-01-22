import { useState } from "react";
import type { ILocalization, ILocalizationCommon } from "#lib/localization";
import { createPlacePageURL } from "#lib/urls";
import { DescriptionList } from "#components";
import { Form, type IFormEvent } from "#components/form";
import {
  InputSectionNanoID,
  InputSectionSelect,
  InputSectionText,
} from "#components/form/section";
import { InputHidden, InputOption } from "#components/form/input";
import { Link } from "#components/link";
import type { IPlace } from "#entities/place";
import { ITask, isTaskStatus } from "./types";

import statusStyles from "./status.module.scss";

export interface ITaskSearchQuery {
  query?: string;
  status?: ITask["status"];
  place_id?: IPlace["id"];
}

export interface ISearchTasksFormProps {
  id: string;
  commonTranslation: ILocalizationCommon;
  translation: ILocalization["todos"];
  statusTranslation: ILocalization["stats_tasks"]["status_values"];
  defaultQuery?: ITaskSearchQuery;
  onSearch: (newSearchQuery: ITaskSearchQuery) => Promise<void>;
  place?: IPlace;
}

export function SearchTasksForm({
  commonTranslation,
  translation,
  statusTranslation,
  id,
  defaultQuery,
  place,
  onSearch,
}: ISearchTasksFormProps) {
  const [oldQuery, changeOldQuery] = useState<ITaskSearchQuery | undefined>(
    defaultQuery,
  );
  const { query, search, searching } = translation.search_tasks;
  const { status } = translation;
  const FIELD = {
    QUERY: { name: "query", label: query },
    PLACE: { name: "place_id", label: translation.search_tasks["Place"] },
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
            maxLength={20}
            defaultValue={defaultQuery?.query}
          >
            {FIELD.QUERY.label}
          </InputSectionText>

          {place ? (
            <>
              <DescriptionList
                sections={[
                  [
                    FIELD.PLACE.label,
                    <Link key="place" href={createPlacePageURL(place.id)}>
                      {place.title} ({place.id})
                    </Link>,
                  ],
                ]}
              />
              <InputHidden
                id={`${formID}-${FIELD.PLACE.name}`}
                form={formID}
                name={FIELD.PLACE.name}
                defaultValue={place.id}
              />
            </>
          ) : (
            <InputSectionNanoID
              id={`${formID}-${FIELD.PLACE.name}`}
              form={formID}
              name={FIELD.PLACE.name}
            >
              {FIELD.PLACE.label}
            </InputSectionNanoID>
          )}

          <InputSectionSelect
            label={FIELD.STATUS.label}
            id={`${formID}-${FIELD.STATUS.name}`}
            form={formID}
            name={FIELD.STATUS.name}
            defaultValue={defaultQuery?.status ?? ""}
          >
            <InputOption value="">{statusTranslation.all}</InputOption>

            <InputOption
              className={statusStyles["in-progress"]}
              value="in-progress"
            >
              {statusTranslation["in-progress"]}
            </InputOption>

            <InputOption className={statusStyles.pending} value="pending">
              {statusTranslation.pending}
            </InputOption>

            <InputOption className={statusStyles.finished} value="finished">
              {statusTranslation.finished}
            </InputOption>

            <InputOption className={statusStyles.failed} value="failed">
              {statusTranslation.failed}
            </InputOption>
          </InputSectionSelect>
        </>
      )}
    </Form>
  );
}
