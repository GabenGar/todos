import { useLoaderData } from "react-router";
import browser, { type Scripting } from "webextension-polyfill";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { JavascriptValue } from "@repo/ui/javascript";
import { Page } from "@repo/ui/pages";
import { useTranslation } from "#hooks";
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

  const results = await browser.scripting.executeScript(injectionDetails);

  

  return results;
}
