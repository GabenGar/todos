import { useLoaderData } from "react-router";
import browser, { type Scripting } from "webextension-polyfill";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { ErrorView, isError, UnknownError } from "@repo/ui/errors";
import { Preformatted } from "@repo/ui/formatting";
import { Heading } from "@repo/ui/headings";
import { List, ListItem } from "@repo/ui/lists";
import { Page } from "@repo/ui/pages";
import { MetaTagView } from "#components/seo";
import { useTranslation } from "#hooks";
import { type IMessage, parseMessage } from "#lib/messages";
import { getCurrentTabID } from "#lib/tabs";
//

import styles from "./page.module.scss";

export function HomePage() {
  const { t } = useTranslation();
  const data = useLoaderData<typeof loader>();
  const heading = t((t) => t.action.heading);

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader></OverviewHeader>

            <OverviewBody>
              {isError(data) ? (
                <ErrorView error={data} />
              ) : (
                <>
                  <Heading level={headingLevel}>
                    {t((t) => t.action["base-info"])}
                  </Heading>

                  <DescriptionList>
                    <DescriptionSection
                      dKey={t((t) => t.action.title)}
                      dValue={
                        !data.seo.title ? undefined : !Array.isArray(
                            data.seo.title,
                          ) ? (
                          <Preformatted>{data.seo.title}</Preformatted>
                        ) : (
                          <List>
                            {data.seo.title.map((title, index) => (
                              <ListItem key={index}>
                                <Preformatted>{title}</Preformatted>
                              </ListItem>
                            ))}
                          </List>
                        )
                      }
                      isKeyPreformatted
                    />
                  </DescriptionList>

                  <Heading level={headingLevel}>
                    {t((t) => t.action["meta-elements"], {
                      count: data.seo.metaTags.length,
                    })}
                  </Heading>
                  <List className={styles.list} isOrdered>
                    {data.seo.metaTags.map((metaTag, index) => (
                      <ListItem key={index}>
                        <MetaTagView metaTag={metaTag} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader() {
  const tabID = await getCurrentTabID();
  const injectionDetails: Scripting.ScriptInjection = {
    files: ["/content-script/content-script.js"],
    target: {
      tabId: tabID,
    },
  };

  const result = await new Promise<IMessage["data"]>((resolve, reject) => {
    browser.runtime.onMessage.addListener(listenForSEO);
    browser.scripting.executeScript(injectionDetails);

    async function listenForSEO(message: unknown) {
      try {
        const data = parseMessage(message, "seo");
        resolve(data);
      } catch (error) {
        if (isError(error)) {
          reject(error);
        } else {
          reject(new UnknownError(error));
        }
      }
    }
  }).catch((error) => (isError(error) ? error : new UnknownError(error)));

  return result;
}
