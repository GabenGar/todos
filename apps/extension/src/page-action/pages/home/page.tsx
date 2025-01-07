import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import { Overview, OverviewBody } from "@repo/ui/articles";
import { Page } from "@repo/ui/pages";
import { getLocalizedMessage } from "#lib/localization";
import { getActiveTab } from "#lib/tabs";
import { URLViewer } from "#components/urls";

import styles from "./page.module.scss";

export function HomePage() {
  const url = useLoaderData() as URL | undefined;

  return (
    <Page>
      <Overview className={styles.article} headingLevel={2}>
        {() => (
          <>
            <OverviewBody>
              {!url || !(url instanceof URL) ? (
                getLocalizedMessage("No URL is selected.")
              ) : (
                <URLViewer headingLevel={2} url={url} />
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({}: LoaderFunctionArgs) {
  const currentTab = await getActiveTab();
  const url = currentTab.url;

  return !url ? url : new URL(url);
}
