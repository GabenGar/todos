import type { ILocalizationEntities } from "#lib/localization";
import { Form, IFormEvent, type IFormComponentProps } from "#components/form";
import { InputSectionText } from "#components/form/section";
import type { ITranslatableProps } from "#components/types";
import type { IPlannedEventInit } from "../types";
import { validatePlannedEventInit } from "../lib/validate";

interface IProps extends IFormComponentProps, ITranslatableProps {
  translation: ILocalizationEntities["planned_event"];
  onNewPlannedEvent: (init: IPlannedEventInit) => Promise<void>;
}

export function PlannedEventCreateForm({
  commonTranslation,
  translation,
  id,
  onNewPlannedEvent,
}: IProps) {
  const FIELD = {
    TITLE: { name: "title", label: translation["Title"] },
    DESCRIPTION: { name: "description", label: translation["Description"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const formElements = event.currentTarget.elements;
    const title = formElements.title.value.trim();
    const description = formElements.description.value.trim();

    const init: IPlannedEventInit = {
      title,
    };

    if (description.length) {
      init.description = description;
    }

    validatePlannedEventInit(init)
    await onNewPlannedEvent(init);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      onSubmit={handleSubmit}
      submitButton={(formID, isSubmitting) =>
        !isSubmitting
          ? translation["Add planned event"]
          : translation["Adding planned event..."]
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
