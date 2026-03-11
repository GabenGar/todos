import { InputSectionText } from "@repo/ui/forms/sections";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import { usePageTranslation } from "#hooks";

export interface IBaseURLFormProps extends IFormComponentProps {
  onNewURL: (newURL: URL | true) => Promise<void>;
}
export function BaseURLForm({ id, onNewURL }: IBaseURLFormProps) {
  const { t } = usePageTranslation("page-url-edit");
  const FIELD = {
    URL: { name: "url", label: t((t) => t["Base URL"]) },
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
      id={id}
      submitButton={(_formID, isSubmitting) =>
        t((t) => (!isSubmitting ? t["Parse"] : t["Parsing..."]))
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
            {t(
              (t) =>
                t[
                  "A URL which will be used as a base for editing, if provided."
                ],
            )}
          </p>
        </>
      )}
    </Form>
  );
}
