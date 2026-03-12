import { Form, type IFormEvent } from "#components/form";
import {
  InputSectionDescription,
  InputSectionTitle,
} from "#components/form/section";
import { useTranslation } from "#hooks";
import type { IPlace, IPlaceUpdate } from "../types";

export interface IEditPlaceFormProps {
  id: string;
  currentPlace: IPlace;
  onPlaceEdit: (placeUpdate: IPlaceUpdate) => Promise<void>;
}

export function EditPlaceForm({
  currentPlace,
  id,
  onPlaceEdit,
}: IEditPlaceFormProps) {
  const { t } = useTranslation("translation");
  const FIELD = {
    TITLE: { name: "title", label: t((t) => t.place.title) },
    DESCRIPTION: { name: "description", label: t((t) => t.place.description) },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();

    const update: IPlaceUpdate = {
      id: currentPlace.id,
    };

    if (!title && !description) {
      return;
    }

    if (title && title !== currentPlace.title) {
      update.title = title;
    }

    if (description && description !== currentPlace.description) {
      update.description = description;
    }

    await onPlaceEdit(update);
  }

  return (
    <Form
      id={id}
      submitButton={(_formID, isSubmitting) =>
        t((t) =>
          !isSubmitting
            ? t.place.edit["Confirm changes"]
            : t.place.edit["Applying changes..."],
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
            defaultValue={currentPlace.title}
          >
            {FIELD.TITLE.label}
          </InputSectionTitle>

          <InputSectionDescription
            id={`${formID}-${FIELD.DESCRIPTION.name}`}
            form={formID}
            name={FIELD.DESCRIPTION.name}
            rows={4}
            defaultValue={currentPlace.description}
          >
            {FIELD.DESCRIPTION.label}
          </InputSectionDescription>
        </>
      )}
    </Form>
  );
}
