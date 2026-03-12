import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import { InputSectionText } from "#components/form/section";
import { useTranslation } from "#hooks";
import type { IPlaceInit } from "../types";

interface IProps extends IFormComponentProps {
  onNewPlace: (init: IPlaceInit) => Promise<void>;
}

export function PlaceCreateForm({ id, onNewPlace }: IProps) {
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
      id={id}
      onSubmit={handleSubmit}
      submitButton={(_formID, isSubmitting) =>
        t((t) => (!isSubmitting ? t.place.add : t.place.adding))
      }
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
