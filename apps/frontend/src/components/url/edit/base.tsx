import { InputSectionText } from "@repo/ui/forms/sections";
import { type ILocalizationPage } from "#lib/localization";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import type { ITranslatableProps } from "#components/types";

export interface IBaseURLFormProps
  extends ITranslatableProps,
    IFormComponentProps {
  translation: ILocalizationPage["url-editor"];
  onNewURL: (newURL: URL | true) => Promise<void>;
}
export function BaseURLForm({
  commonTranslation,
  translation,
  id,
  onNewURL,
}: IBaseURLFormProps) {
  const FIELD = {
    URL: { name: "url", label: translation["Base URL"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const urlInput = event.currentTarget.elements.url;
    const value = urlInput.value.trim();
    const newURL = value.length === 0 ? true : new URL(value);

    await onNewURL(newURL);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      submitButton={(formID, isSubmitting) =>
        !isSubmitting ? translation["Parse"] : translation["Parsing..."]
      }
      onSubmit={handleSubmit}
    >
      {(formID) => (
        <>
          <InputSectionText
            id={`${formID}-${FIELD.URL.name}`}
            form={formID}
            name={FIELD.URL.name}
          >
            {FIELD.URL.label}
          </InputSectionText>
          <p>
            {
              translation[
                "A URL which will be used as a base for editing, if provided."
              ]
            }
          </p>
        </>
      )}
    </Form>
  );
}
