import { useState, useEffect } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Html5Qrcode } from "html5-qrcode";
import { getDictionary, type ILocalization } from "#lib/localization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { DescriptionList, DescriptionSection } from "#components";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import type { ITranslatableProps } from "#components/types";
import { InputSectionFile } from "#components/form/section";

interface IProps extends ILocalizedProps<"qr_code_reader"> {}

interface IParams extends ILocalizedParams {}

function QRCodeReaderPage({
  translation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [content, changeContent] = useState<string>();
  const { common, t } = translation;
  const title = t.title;

  return (
    <Page heading={t.heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <QRCodeReaderForm
                commonTranslation={common}
                translation={t}
                id="qr-code-reader"
                onSuccessfulScan={async (result) => changeContent(result)}
              />
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection
                  dKey={t.result}
                  dValue={content ?? t.no_result}
                />
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

interface IFormProps extends ITranslatableProps, IFormComponentProps {
  translation: ILocalization["pages"]["qr_code_reader"];
  onSuccessfulScan: (result: string) => Promise<void>;
}

function QRCodeReaderForm({
  commonTranslation,
  translation,
  id,
  onSuccessfulScan,
}: IFormProps) {
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

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const props = {
    translation: {
      lang,
      common: dict.common,
      t: dict.pages["qr_code_reader"],
    },
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default QRCodeReaderPage;
