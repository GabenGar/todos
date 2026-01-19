import { useState } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { ButtonCopy } from "@repo/ui/buttons";
import { getDictionary } from "#lib/localization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { BaseURLForm, URLEditorForm } from "#components/url";
import {
  Overview,
  OverviewHeader,
  OverviewBody,
  OverviewFooter,
} from "@repo/ui/articles";

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
  const fullURL = !finalURL ? undefined : String(finalURL);
  const decodedFullURL = !fullURL ? undefined : decodeURI(fullURL);
  const encodedFullURL = !fullURL ? undefined : encodeURI(fullURL);

  return (
    <Page heading={t.heading} title={title}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader isFilled>
              <BaseURLForm
                id={baseID}
                commonTranslation={common}
                translation={t}
                onNewURL={async (newURL) => changeBaseURL(newURL)}
              />
            </OverviewHeader>

            {!baseURL ? undefined : (
              <OverviewBody isFilled>
                <URLEditorForm
                  id={editID}
                  commonTranslation={common}
                  t={t}
                  baseURL={baseURL}
                  onNewURL={async (newURL) => changeFinalURL(newURL)}
                />
              </OverviewBody>
            )}

            {!finalURL ? undefined : (
              <OverviewFooter>
                <DescriptionList>
                  {decodedFullURL === encodedFullURL ? (
                    <DescriptionSection
                      dKey={t["Full URL"]}
                      dValue={
                        <>
                          <Preformatted>{decodedFullURL}</Preformatted>
                          <ButtonCopy
                            translation={common.button}
                            valueToCopy={decodedFullURL!}
                          />
                        </>
                      }
                    />
                  ) : (
                    <>
                      <DescriptionSection
                        dKey={t["Decoded URL"]}
                        dValue={
                          <>
                            <Preformatted>{decodedFullURL}</Preformatted>
                            <ButtonCopy
                              translation={common.button}
                              valueToCopy={decodedFullURL!}
                            />
                          </>
                        }
                      />
                      <DescriptionSection
                        dKey={t["Encoded URL"]}
                        dValue={
                          <>
                            <Preformatted>{encodedFullURL}</Preformatted>
                            <ButtonCopy
                              translation={common.button}
                              valueToCopy={encodedFullURL!}
                            />
                          </>
                        }
                      />
                    </>
                  )}
                </DescriptionList>
              </OverviewFooter>
            )}
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
