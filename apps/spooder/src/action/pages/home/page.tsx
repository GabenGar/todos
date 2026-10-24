import { useLoaderData } from "react-router";
import browser, { type Scripting } from "webextension-polyfill";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { ErrorView, isError, validateError } from "@repo/ui/errors";
import { JavascriptValue } from "@repo/ui/javascript";
import { List } from "@repo/ui/lists";
import { Page } from "@repo/ui/pages";
import { MetaTagView } from "#components/seo";
import { useTranslation } from "#hooks";
import { type IMessage, parseMessage } from "#lib/messages";
import { getCurrentTabID } from "#lib/tabs";

export function HomePage() {
  const { t } = useTranslation();
  const data = useLoaderData<typeof loader>();
  const heading = t((t) => t.action.heading);

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <JavascriptValue data={data} />
            </OverviewHeader>

            <OverviewBody>
              {isError(data) ? (
                <ErrorView error={data} />
              ) : (
                <List isOrdered>
                  {data.map((metaTag, index) => (
                    <MetaTagView key={index} metaTag={metaTag} />
                  ))}
                </List>
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

  await browser.scripting.executeScript(injectionDetails);

  const result = await new Promise<IMessage["data"]>((resolve) => {
    browser.runtime.onMessage.addListener(listenForSEO);

    async function listenForSEO(message: unknown) {
      const data = parseMessage(message, "seo");

      resolve(data);
    }
  }).catch((error) => {
    validateError(error);

    return error;
  });

  return result;
}
