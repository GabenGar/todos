

import { InputOption } from "@repo/ui/forms/inputs";
import { InputSectionSelect } from "@repo/ui/forms/sections";
import type { ILocalizationEntities } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import type { ITranslatableProps } from "#components/types";
import type { IPlannedEventOrder } from "../types";
import { isPlannedEventsOrder } from "../lib/get";

export interface IPlannedEventSearchQuery {
  order?: IPlannedEventOrder;
}

interface ISearchPlannedEventFormProps extends ITranslatableProps {
  id: string;
  translation: ILocalizationEntities["planned_event"];
  defaultOrder?: IPlannedEventOrder;
  onSearch: (newSearchQuery: IPlannedEventSearchQuery) => Promise<void>;
}

export function SearchPlannedEventForm({
  commonTranslation,
  translation,
  id,
  defaultOrder,
  onSearch,
}: ISearchPlannedEventFormProps) {
  const FIELD = {
    ORDER: { name: "order", label: translation["Order"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const inputOrder = formElements.order.value.trim();
    const parsedOrder = !isPlannedEventsOrder(inputOrder)
      ? undefined
      : inputOrder;

    if (defaultOrder && parsedOrder === defaultOrder) {
      return;
    }

    const newSearchQuery: IPlannedEventSearchQuery = {
      order: parsedOrder,
    };

    await onSearch(newSearchQuery);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      onSubmit={handleSubmit}
      submitButton={(_, isSubmitting) =>
        !isSubmitting ? translation["Filter"] : translation["Filtering..."]
      }
    >
      {(formID) => (
        <>
          <InputSectionSelect
            id={`${formID}-${FIELD.ORDER.name}`}
            form={formID}
            name={FIELD.ORDER.name}
            label={FIELD.ORDER.label}
            defaultValue={defaultOrder ?? ""}
          >
            <InputOption
              value={"recently_updated" satisfies IPlannedEventOrder}
            >
              {translation["Recently updated"]}
            </InputOption>
            <InputOption value={""}>
              {translation["Recently created"]}
            </InputOption>
          </InputSectionSelect>
        </>
      )}
    </Form>
  );
}
