import type { ILocalization } from "#lib/localization";
import { Form, type IFormEvent } from "#components/form";
import {
  InputSectionDescription,
  InputSectionTitle,
} from "#components/form/section";
import type { ITranslatableProps } from "#components/types";
import { type IPlace, type IPlaceUpdate } from "../types";

export interface IEditPlaceFormProps extends ITranslatableProps {
  translation: ILocalization["place"];
  id: string;
  currentPlace: IPlace;
  onPlaceEdit: (placeUpdate: IPlaceUpdate) => Promise<void>;
}

export function EditPlaceForm({
  commonTranslation,
  translation,
  currentPlace: currentTask,
  id,
  onPlaceEdit,
}: IEditPlaceFormProps) {
  const { title, description, edit } = translation;
  const FIELD = {
    TITLE: { name: "title", label: title },
    DESCRIPTION: { name: "description", label: description },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();

    const update: IPlaceUpdate = {
      id: currentTask.id,
    };

    if (!title && !description) {
      return;
    }

    if (title && title !== currentTask.title) {
      update.title = title;
    }

    if (description && description !== currentTask.description) {
      update.description = description;
    }

    await onPlaceEdit(update);
  }

  return (
    <Form
      commonTranslation={commonTranslation}
      id={id}
      submitButton={(formID, isSubmitting) =>
        !isSubmitting ? edit["Confirm changes"] : edit["Applying changes..."]
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
            defaultValue={currentTask.title}
          >
            {FIELD.TITLE.label}
          </InputSectionTitle>

          <InputSectionDescription
            id={`${formID}-${FIELD.DESCRIPTION.name}`}
            form={formID}
            name={FIELD.DESCRIPTION.name}
            rows={4}
            defaultValue={currentTask.description}
          >
            {FIELD.DESCRIPTION.label}
          </InputSectionDescription>
        </>
      )}
    </Form>
  );
}
