import { useState } from "react";
import { URLViewer } from "@repo/ui/url";
import { Page } from "#components";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import { InputSectionText } from "#components/form/section";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { usePageTranslation } from "#hooks";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function URLViewerPage() {
  const { t } = usePageTranslation("page-url");
  const [currentURL, changeCurrentURL] = useState<URL>();
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <URLViewerForm
                id="url-viewer"
                onNewURL={async (newURL) => changeCurrentURL(newURL)}
              />
            </OverviewHeader>

            <OverviewBody>
              {!currentURL ? (
                t((t) => t["No URL selected."])
              ) : (
                <URLViewer headingLevel={headingLevel} url={currentURL} />
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

interface IFormProps extends IFormComponentProps {
  onNewURL: (newURL: URL) => Promise<void>;
}

export function URLViewerForm({ id, onNewURL }: IFormProps) {
  const { t } = usePageTranslation("page-url");
  const FIELD = {
    URL: { name: "url", label: t((t) => t["URL"]) },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const urlInput = event.currentTarget.elements.url;
    const newURL = new URL(urlInput.value.trim());

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
        </>
      )}
    </Form>
  );
}

export const getStaticProps = createGetStaticProps("page-url");
export const getStaticPaths = getStaticExportPaths;

export default URLViewerPage;
