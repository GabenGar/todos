// not sure why it needs this directive considering
// it's only called from the client component

import { useState } from "react";
import type { ILocalization } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import { InputSectionText } from "#components/form/section";
import { ITranslatableProps } from "#components/types";

export interface IPlaceSearchQuery {
  query?: string;
}

export interface ISearchPlacesFormProps extends ITranslatableProps {
  id: string;
  translation: ILocalization["place"];
  defaultQuery?: IPlaceSearchQuery;
  onSearch: (newSearchQuery: IPlaceSearchQuery) => Promise<void>;
}

export function SearchPlacesForm({
  commonTranslation,
  translation,
  id,
  defaultQuery,
  onSearch,
}: ISearchPlacesFormProps) {
  const [oldQuery, changeOldQuery] = useState<IPlaceSearchQuery | undefined>(
    defaultQuery,
  );
  const FIELD = {
    QUERY: { name: "query", label: translation.search["Query"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const query = formElements.query.value.trim();

    if (oldQuery && query === oldQuery.query) {
      return;
    }

    const newSearchQuery: IPlaceSearchQuery = {
      query,
    };

    changeOldQuery(newSearchQuery);
    await onSearch(newSearchQuery);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      onSubmit={handleSubmit}
      submitButton={(_, isSubmitting) =>
        !isSubmitting
          ? translation.search["Search"]
          : translation.search["Searching..."]
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
        </>
      )}
    </Form>
  );
}
