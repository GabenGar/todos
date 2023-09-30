import type { ILocalization } from "#lib/localization";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import type { ITranslatableProps } from "#components/types";
import { InputSectionFile } from "#components/form/section";

interface IProps extends ITranslatableProps, IFormComponentProps {
  translation: ILocalization["pages"]["qr_code_reader"];
}

export function QRCodeReaderForm({
  commonTranslation,
  translation,
  id,
}: IProps) {
  const { form } = translation;
  const FIELD = {
    FILE: { name: "file", label: form.file_label },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const filesInput = event.currentTarget.elements.file;
    const files = filesInput.files;

    if (files === null) {
      return;
    }

    const QRCodeFile = files.item(0);
  }

  return (
    <Form<IFieldName>
      commonTranslation={commonTranslation}
      id={id}
      submitButton={(formID, isSubmitting) =>
        !isSubmitting ? form.scan : form.scanning
      }
      onSubmit={handleSubmit}
    >
      {(formID) => (
        <>
          <InputSectionFile
            id={`${formID}-${FIELD.FILE.name}`}
            form={formID}
            name={FIELD.FILE.name}
            accept="image/*"
            required
          >
            {FIELD.FILE.label}
          </InputSectionFile>
        </>
      )}
    </Form>
  );
}
