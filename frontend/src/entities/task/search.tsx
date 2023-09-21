import { useState } from "react";
import type { ILocalization, ILocalizationCommon } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import { InputSectionText } from "#components/form/section";

// import styles from "./search.module.scss";

interface IProps {
  id: string;
  commonTranslation: ILocalizationCommon;
  translation: ILocalization["todos"]["search_tasks"];
  onSearch: (newQuery: string) => Promise<void>;
}

export function SearchTasksForm({
  commonTranslation,
  translation,
  id,
  onSearch,
}: IProps) {
  const [currentQuery, changeCurrentQuery] = useState<string>();
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

    await onSearch(query);
    changeCurrentQuery(query);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      onSubmit={handleSubmit}
      submitButton={(formID, isSubmitting) =>
        !isSubmitting ? search : searching
      }
    >
      {(formID, isSubmitting) => (
        <>
          <InputSectionText
            id={`${formID}-${FIELD.QUERY.name}`}
            form={formID}
            name={FIELD.QUERY.name}
            minLength={1}
            maxLength={32}
            required
          >
            {FIELD.QUERY.label}
          </InputSectionText>
        </>
      )}
    </Form>
  );
}
