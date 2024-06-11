import type { ILocalizationEntities } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import {
  InputSectionDescription,
  InputSectionTitle,
} from "#components/form/section";
import type { ITranslatableProps } from "#components/types";
import { type IPlannedEvent, type IPlannedEventUpdate } from "../types";

interface IProps extends ITranslatableProps {
  translation: ILocalizationEntities["planned_event"];
  id: string;
  currentPlannedEvent: IPlannedEvent;
  onPlannedEventEdit: (
    plannedEventUpdate: IPlannedEventUpdate,
  ) => Promise<void>;
}

export function EditPlannedEventForm({
  commonTranslation,
  translation,
  currentPlannedEvent,
  id,
  onPlannedEventEdit,
}: IProps) {
  const { form } = commonTranslation;
  const FIELD = {
    TITLE: { name: "title", label: translation["Title"] },
    DESCRIPTION: { name: "description", label: translation["Description"] },
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
      commonTranslation={commonTranslation}
      id={id}
      submitButton={(formID, isSubmitting) =>
        !isSubmitting ? form["Confirm changes"] : form["Applying changes..."]
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
