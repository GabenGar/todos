import { InputOption } from "@repo/ui/forms/inputs";
import { InputSectionSelect } from "@repo/ui/forms/sections";
import { Form, type IFormEvent } from "#components/form";
import { useTranslation } from "#hooks";
import { isPlannedEventsOrder } from "../lib/get";
import type { IPlannedEventOrder } from "../types";

export interface IPlannedEventSearchQuery {
  order?: IPlannedEventOrder;
}

interface ISearchPlannedEventFormProps {
  id: string;
  defaultOrder?: IPlannedEventOrder;
  onSearch: (newSearchQuery: IPlannedEventSearchQuery) => Promise<void>;
}

export function SearchPlannedEventForm({
  id,
  defaultOrder,
  onSearch,
}: ISearchPlannedEventFormProps) {
  const { t } = useTranslation("translation");
  const FIELD = {
    ORDER: { name: "order", label: t((t) => t.planned_event["Order"]) },
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
      id={id}
      onSubmit={handleSubmit}
      submitButton={(_, isSubmitting) =>
        t((t) =>
          !isSubmitting
            ? t.planned_event["Filter"]
            : t.planned_event["Filtering..."],
        )
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
              {t((t) => t.planned_event["Recently updated"])}
            </InputOption>
            <InputOption value={""}>
              {t((t) => t.planned_event["Recently created"])}
            </InputOption>
          </InputSectionSelect>
        </>
      )}
    </Form>
  );
}
