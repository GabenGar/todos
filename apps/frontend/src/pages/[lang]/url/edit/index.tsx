import { useState } from "react";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "@repo/ui/articles";
import { ButtonCopy } from "@repo/ui/buttons";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { Page } from "#components";
import { BaseURLForm, URLEditorForm } from "#components/url";
import { usePageTranslation } from "#hooks";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function URLEditorPage() {
  const { t } = usePageTranslation("page-url-edit");
  const [baseURL, changeBaseURL] = useState<URL | true>();
  const [finalURL, changeFinalURL] = useState<URL>();
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);
  const baseID = "base-url";
  const editID = "edit-url";
  const fullURL = !finalURL ? undefined : String(finalURL);
  const decodedFullURL = !fullURL ? undefined : decodeURI(fullURL);
  const encodedFullURL = !fullURL ? undefined : encodeURI(fullURL);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader isFilled>
              <BaseURLForm
                id={baseID}
                onNewURL={async (newURL) => changeBaseURL(newURL)}
              />
            </OverviewHeader>

            {!baseURL ? undefined : (
              <OverviewBody isFilled>
                <URLEditorForm
                  id={editID}
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
                      dKey={t((t) => t["Full URL"])}
                      dValue={
                        <>
                          <Preformatted>{decodedFullURL}</Preformatted>
                          <ButtonCopy
                            // biome-ignore lint/style/noNonNullAssertion: blah
                            valueToCopy={decodedFullURL!}
                          />
                        </>
                      }
                    />
                  ) : (
                    <>
                      <DescriptionSection
                        dKey={t((t) => t["Decoded URL"])}
                        dValue={
                          <>
                            <Preformatted>{decodedFullURL}</Preformatted>
                            <ButtonCopy
                              // biome-ignore lint/style/noNonNullAssertion: blah
                              valueToCopy={decodedFullURL!}
                            />
                          </>
                        }
                      />
                      <DescriptionSection
                        dKey={t((t) => t["Encoded URL"])}
                        dValue={
                          <>
                            <Preformatted>{encodedFullURL}</Preformatted>
                            <ButtonCopy
                              // biome-ignore lint/style/noNonNullAssertion: blah
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

export const getStaticProps = createGetStaticProps("page-url-edit");

export const getStaticPaths = getStaticExportPaths;

export default URLEditorPage;
