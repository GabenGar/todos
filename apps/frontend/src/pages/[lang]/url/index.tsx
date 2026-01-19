import { useState } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { URLViewer } from "@repo/ui/url";
import { getDictionary, type ILocalizationPage } from "#lib/localization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import {
  Form,
  type IFormComponentProps,
  type IFormEvent,
} from "#components/form";
import { InputSectionText } from "#components/form/section";
import type { ITranslatableProps } from "#components/types";

interface IProps extends ILocalizedProps<"url-viewer"> {}

interface IParams extends ILocalizedParams {}

function URLViewerPage({
  translation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [currentURL, changeCurrentURL] = useState<URL>();
  const { common, t } = translation;
  const title = t.title;
  /**
   * t. Alberto Barbosa
   */
  function coreT(key: keyof typeof t) {
    return t[key];
  }

  return (
    <Page heading={t.heading} title={title}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <URLViewerForm
                commonTranslation={common}
                translation={t}
                id="url-viewer"
                onNewURL={async (newURL) => changeCurrentURL(newURL)}
              />
            </OverviewHeader>

            <OverviewBody>
              {!currentURL ? (
                t["No URL selected."]
              ) : (
                <URLViewer
                  t={coreT}
                  headingLevel={headingLevel}
                  url={currentURL}
                />
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

interface IFormProps extends ITranslatableProps, IFormComponentProps {
  translation: ILocalizationPage["url-viewer"];
  onNewURL: (newURL: URL) => Promise<void>;
}

export function URLViewerForm({
  commonTranslation,
  translation,
  id,
  onNewURL,
}: IFormProps) {
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

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const props = {
    translation: {
      lang,
      common: dict.common,
      t: dict.pages["url-viewer"],
    },
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default URLViewerPage;
