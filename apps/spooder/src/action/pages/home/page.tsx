import { useLoaderData } from "react-router";
import browser, { type Scripting } from "webextension-polyfill";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { ErrorView, isError, UnknownError } from "@repo/ui/errors";
import { Page } from "@repo/ui/pages";
import { SEOView } from "#components/seo";
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
        {(headingLevel) => (
          <>
            <OverviewHeader></OverviewHeader>

            <OverviewBody>
              {isError(data) ? (
                <ErrorView error={data} />
              ) : (
                <SEOView seo={data.seo} />
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
