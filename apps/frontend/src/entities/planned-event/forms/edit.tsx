import { Form, type IFormEvent } from "#components/form";
import {
  InputSectionDescription,
  InputSectionTitle,
} from "#components/form/section";
import { useTranslation } from "#hooks";
import type { IPlannedEvent, IPlannedEventUpdate } from "../types";

interface IProps {
  id: string;
  currentPlannedEvent: IPlannedEvent;
  onPlannedEventEdit: (
    plannedEventUpdate: IPlannedEventUpdate,
  ) => Promise<void>;
}

export function EditPlannedEventForm({
  currentPlannedEvent,
  id,
  onPlannedEventEdit,
}: IProps) {
  const { t } = useTranslation("translation");
  const { t: cT } = useTranslation("common");
  const FIELD = {
    TITLE: { name: "title", label: t((t) => t.planned_event["Title"]) },
    DESCRIPTION: {
      name: "description",
      label: t((t) => t.planned_event["Description"]),
    },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();

    const update: IPlannedEventUpdate = {
      id: currentPlannedEvent.id,
    };

    if (!title && !description) {
      return;
    }

    if (title && title !== currentPlannedEvent.title) {
      update.title = title;
    }

    if (description && description !== currentPlannedEvent.description) {
      update.description = description;
    }

    await onPlannedEventEdit(update);
  }

  return (
    <Form
      id={id}
      submitButton={(_formID, isSubmitting) =>
        cT((t) =>
          !isSubmitting
            ? t.form["Confirm changes"]
            : t.form["Applying changes..."],
        )
      }
      onSubmit={handleSubmit}
    >
      {(formID) => (
        <>
          <InputSectionTitle
            id={`${formID}-${FIELD.TITLE.name}`}
            form={formID}
            name={FIELD.TITLE.name}
            rows={2}
            defaultValue={currentPlannedEvent.title}
          >
            {FIELD.TITLE.label}
          </InputSectionTitle>

          <InputSectionDescription
            id={`${formID}-${FIELD.DESCRIPTION.name}`}
            form={formID}
            name={FIELD.DESCRIPTION.name}
            rows={4}
            defaultValue={currentPlannedEvent.description}
          >
            {FIELD.DESCRIPTION.label}
          </InputSectionDescription>
        </>
      )}
    </Form>
  );
}
