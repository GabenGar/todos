import { NotImplementedError } from "@repo/ui/errors";
import { FormClient, type IFormEvent } from "@repo/ui/forms";
import { InputSectionFile } from "@repo/ui/forms/sections";
import { DescriptionList, DescriptionSection, Page } from "#components";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { usePageTranslation } from "#hooks";
import { createGetStaticProps, getStaticExportPaths } from "#server";
import type { IPageNamespace } from "#translation";

const namespace = "page-file-analyzer" satisfies IPageNamespace;

function QRCodeReaderPage() {
  const { t } = usePageTranslation(namespace);
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);
  const formID = "file-analyzer";

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <FileForm id={formID} />
            </OverviewHeader>

            <OverviewBody>
              <DescriptionList>
                <DescriptionSection />
              </DescriptionList>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

interface IFileProps {
  id: string;
}

function FileForm({ id }: IFileProps) {
  const { t } = usePageTranslation(namespace);
  const FIELD = {
    FILE: { name: "file", label: t((t) => t.form.label) },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    throw new NotImplementedError();
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
