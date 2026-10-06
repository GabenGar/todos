import { useState } from "react";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { FileOverview, type IFileOverview } from "@repo/ui/files";
import { FormClient, type IFormEvent } from "@repo/ui/forms";
import { InputSectionFile } from "@repo/ui/forms/sections";
import { Page } from "#components";
import { usePageTranslation } from "#hooks";
import { createGetStaticProps, getStaticExportPaths } from "#server";
import type { IPageNamespace } from "#translation";

const namespace = "page-file-analyzer" satisfies IPageNamespace;

function QRCodeReaderPage() {
  const { t } = usePageTranslation(namespace);
  const [fileOverview, changeFileOverview] = useState<IFileOverview>();
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);
  const formID = "file-analyzer";

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader isFilled>
              <FileForm
                id={formID}
                onSuccess={async (overview) => changeFileOverview(overview)}
              />
            </OverviewHeader>

            {!fileOverview ? undefined : (
              <OverviewBody>
                <FileOverview headingLevel={3} overview={fileOverview} />
              </OverviewBody>
            )}
          </>
        )}
      </Overview>
    </Page>
  );
}

interface IFileProps {
  id: string;
  onSuccess: (overview: IFileOverview) => Promise<void>;
}

function FileForm({ id, onSuccess }: IFileProps) {
  const { t } = usePageTranslation(namespace);
  const FIELD = {
    FILE: { name: "file", label: t((t) => t.form.label) },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const filesInput = event.currentTarget.elements.file;
    const files = filesInput.files;

    if (files === null) {
      return;
    }

    // biome-ignore lint/style/noNonNullAssertion: blah
    const file = files.item(0)!;
    const overview = { file } satisfies IFileOverview;

    await onSuccess(overview);
  }

  return (
    <FormClient<IFieldName>
      id={id}
      onSubmit={handleSubmit}
      submitButton={(_, isSubmitting) =>
        t((t) => (isSubmitting ? t.form.submitting : t.form.submit))
      }
    >
      {(formID) => (
        <InputSectionFile
          id={`${formID}-${FIELD.FILE.name}`}
          form={formID}
          name={FIELD.FILE.name}
          label={FIELD.FILE.label}
          multiple={false}
          required
        >
          {}
        </InputSectionFile>
      )}
    </FormClient>
  );
}

export const getStaticProps = createGetStaticProps(namespace);
export const getStaticPaths = getStaticExportPaths;

export default QRCodeReaderPage;
