import { useState } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Heading } from "@repo/ui/headings";
import { getDictionary } from "#lib/localization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import {
  Overview,
  OverviewBody,
  OverviewHeader,
  OverviewFooter,
} from "#components/overview";

import { BaseURLForm, URLEditorForm } from "#components/url";

interface IProps extends ILocalizedProps<"url-editor"> {}

interface IParams extends ILocalizedParams {}

function URLViewerPage({
  translation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [baseURL, changeBaseURL] = useState<URL | true>();
  const [finalURL, changeFinalURL] = useState<URL>();
  const { common, t } = translation;
  const title = t.title;
  const baseID = "base-url";
  const editID = "edit-url";
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
              <BaseURLForm
                id={baseID}
                commonTranslation={common}
                translation={t}
                onNewURL={async (newURL) => changeBaseURL(newURL)}
              />
            </OverviewHeader>

            {!baseURL ? undefined : (
              <OverviewBody>
                <URLEditorForm
                  id={editID}
                  commonTranslation={common}
                  translation={t}
                  baseURL={baseURL}
                  onNewURL={async (newURL) => changeFinalURL(newURL)}
                />
              </OverviewBody>
            )}

            {!finalURL ? undefined : <OverviewFooter></OverviewFooter>}
          </>
        )}
      </Overview>
    </Page>
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
      t: dict.pages["url-editor"],
    },
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default URLViewerPage;
