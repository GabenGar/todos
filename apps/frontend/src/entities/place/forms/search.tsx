import { useState } from "react";
import { Form, type IFormEvent } from "#components/form";
import { InputSectionText } from "#components/form/section";
import { useTranslation } from "#hooks";

export interface IPlaceSearchQuery {
  query?: string;
}

export interface ISearchPlacesFormProps {
  id: string;
  defaultQuery?: IPlaceSearchQuery;
  onSearch: (newSearchQuery: IPlaceSearchQuery) => Promise<void>;
}

export function SearchPlacesForm({
  id,
  defaultQuery,
  onSearch,
}: ISearchPlacesFormProps) {
  const { t } = useTranslation("translation");
  const [oldQuery, changeOldQuery] = useState<IPlaceSearchQuery | undefined>(
    defaultQuery,
  );
  const FIELD = {
    QUERY: { name: "query", label: t((t) => t.place.search["Query"]) },
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
      id={id}
      onSubmit={handleSubmit}
      submitButton={(_, isSubmitting) =>
        t((t) =>
          !isSubmitting
            ? t.place.search["Search"]
            : t.place.search["Searching..."],
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
        </>
      )}
    </Form>
  );
}
