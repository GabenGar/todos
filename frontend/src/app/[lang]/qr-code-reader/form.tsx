import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
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
  onSuccessfulScan: (result: string) => Promise<void>;
}

export function QRCodeReaderForm({
  commonTranslation,
  translation,
  id,
  onSuccessfulScan,
}: IProps) {
  const [qrReader, changeQRreader] = useState<Html5Qrcode>();
  const { form } = translation;
  const FIELD = {
    FILE: { name: "file", label: form.file_label },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];
  const readerID = `${id}-qr-reader`;

  useEffect(() => {
    const reader = new Html5Qrcode(readerID);
    changeQRreader(reader);
  }, [readerID]);

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const filesInput = event.currentTarget.elements.file;
    const files = filesInput.files;

    if (!qrReader || files === null) {
      return;
    }

    const QRCodeFile = files.item(0)!;
    const result = await qrReader.scanFile(QRCodeFile, false);

    await onSuccessfulScan(result);
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
          <div id={readerID} />
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
