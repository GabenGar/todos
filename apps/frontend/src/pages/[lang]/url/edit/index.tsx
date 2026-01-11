import { useState } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Heading } from "@repo/ui/headings";
import { InputSectionText } from "@repo/ui/forms/sections";
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
import type { ITranslatableProps } from "#components/types";

interface IProps extends ILocalizedProps<"url-editor"> {}

interface IParams extends ILocalizedParams {}

function URLViewerPage({
  translation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [baseURL, changeBaseURL] = useState<URL>();
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
              <Heading level={headingLevel}>{t["Base URL"]}</Heading>

              <p>
                {
                  t[
                    "A URL which will be used as a base for editing, if provided."
                  ]
                }
              </p>
            </OverviewHeader>
            <OverviewBody></OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

interface IBaseURLFormProps extends ITranslatableProps, IFormComponentProps {
  translation: ILocalizationPage["url-editor"];
  onNewURL: (newURL: URL) => Promise<void>;
}
function BaseURLForm({
  commonTranslation,
  translation,
  id,
  onNewURL,
}: IBaseURLFormProps) {
  const FIELD = {
    URL: { name: "url", label: translation["URL"] },
  } as const;
  type IFieldName = (typeof FIELD)[keyof typeof FIELD]["name"];

  async function handleSubmit(event: IFormEvent<IFieldName>) {
    const urlInput = event.currentTarget.elements.url;
    const newURL = new URL(urlInput.value.trim());

    await onNewURL(newURL);
  }

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
      t: dict.pages["url-editor"],
    },
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default URLViewerPage;
