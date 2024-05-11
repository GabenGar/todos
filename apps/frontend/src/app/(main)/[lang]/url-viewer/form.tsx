import type { ILocalizationPage } from "#lib/localization";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import type { ITranslatableProps } from "#components/types";
import { InputSectionText } from "#components/form/section";

interface IProps extends ITranslatableProps, IFormComponentProps {
  translation: ILocalizationPage["url-viewer"];
  onNewURL: (newURL: URL) => Promise<void>;
}

export function URLViewerForm({
  commonTranslation,
  translation,
  id,
  onNewURL,
}: IProps) {
  const FIELD = {
    URL: { name: "url", label: translation["URL"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const urlInput = event.currentTarget.elements.url;
    const newURL = new URL(urlInput.value.trim());

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
        </>
      )}
    </Form>
  );
}
