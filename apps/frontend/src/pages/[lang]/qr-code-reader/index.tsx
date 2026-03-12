import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import { DescriptionList, DescriptionSection, Page } from "#components";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import { InputSectionFile } from "#components/form/section";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { usePageTranslation } from "#hooks";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function QRCodeReaderPage() {
  const { t } = usePageTranslation("page-qr-code-reader");
  const [content, changeContent] = useState<string>();
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <QRCodeReaderForm
                id="qr-code-reader"
                onSuccessfulScan={async (result) => changeContent(result)}
              />
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection
                  dKey={t((t) => t.result)}
                  dValue={content ?? t((t) => t.no_result)}
                />
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

interface IFormProps extends IFormComponentProps {
  onSuccessfulScan: (result: string) => Promise<void>;
}

function QRCodeReaderForm({ id, onSuccessfulScan }: IFormProps) {
  const { t } = usePageTranslation("page-qr-code-reader");
  const [qrReader, changeQRreader] = useState<Html5Qrcode>();
  const FIELD = {
    FILE: { name: "file", label: t((t) => t.form.file_label) },
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

    // biome-ignore lint/style/noNonNullAssertion: blah
    const QRCodeFile = files.item(0)!;
    const result = await qrReader.scanFile(QRCodeFile, false);

    await onSuccessfulScan(result);
  }

  return (
    <Form<IFieldName>
      id={id}
      submitButton={(_formID, isSubmitting) =>
        t((t) => (!isSubmitting ? t.form.scan : t.form.scanning))
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

export const getStaticProps = createGetStaticProps("page-qr-code-reader");
export const getStaticPaths = getStaticExportPaths;

export default QRCodeReaderPage;
