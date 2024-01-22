import type { ILocalization } from "#lib/localization";
import { Form, IFormEvent, type IFormComponentProps } from "#components/form";
import { InputSectionText } from "#components/form/section";
import type { ITranslatableProps } from "#components/types";
import type { IPlaceInit } from "../types";

interface IProps extends IFormComponentProps, ITranslatableProps {
  translation: ILocalization["place"];
  onNewPlace: (init: IPlaceInit) => Promise<void>;
}

export function PlaceCreateForm({
  commonTranslation,
  translation,
  id,
  onNewPlace,
}: IProps) {
  const { title, description, add, adding } = translation;
  const FIELD = {
    TITLE: { name: "title", label: title },
    DESCRIPTION: { name: "description", label: description },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();

    const init: IPlaceInit = {
      title,
    };

    if (description.length) {
      init.description = description;
    }

    await onNewPlace(init);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      onSubmit={handleSubmit}
      submitButton={(formID, isSubmitting) => (!isSubmitting ? add : adding)}
    >
      {(formID) => (
        <>
          <InputSectionText
            id={`${formID}-${FIELD.TITLE.name}`}
            form={formID}
            name={FIELD.TITLE.name}
            minLength={1}
            maxLength={256}
            rows={2}
            required
          >
            {FIELD.TITLE.label}
          </InputSectionText>

          <InputSectionText
            id={`${formID}-${FIELD.DESCRIPTION.name}`}
            form={formID}
            name={FIELD.DESCRIPTION.name}
            minLength={1}
            maxLength={2048}
            rows={4}
          >
            {FIELD.DESCRIPTION.label}
          </InputSectionText>
        </>
      )}
    </Form>
  );
}
