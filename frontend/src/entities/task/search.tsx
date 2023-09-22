import { useState } from "react";
import type { ILocalization, ILocalizationCommon } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import { InputSectionText } from "#components/form/section";

// import styles from "./search.module.scss";

export interface ISearchTasksFormProps {
  id: string;
  commonTranslation: ILocalizationCommon;
  translation: ILocalization["todos"]["search_tasks"];
  defaultQuery?: string;
  onSearch: (newQuery: string) => Promise<void>;
}

export function SearchTasksForm({
  commonTranslation,
  translation,
  id,
  defaultQuery,
  onSearch,
}: ISearchTasksFormProps) {
  const [currentQuery, changeCurrentQuery] = useState<string | undefined>(
    defaultQuery,
  );
  const { query, search, searching } = translation;
  const FIELD = {
    QUERY: { name: "query", label: query },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const query = formElements.query.value.trim();

    if (currentQuery && query === currentQuery) {
      return;
    }

    changeCurrentQuery(query);
    await onSearch(query);
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
            defaultValue={defaultQuery}
          >
            {FIELD.QUERY.label}
          </InputSectionText>
        </>
      )}
    </Form>
  );
}
