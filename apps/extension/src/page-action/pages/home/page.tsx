import { useLoaderData } from "react-router";
import { Overview, OverviewBody } from "@repo/ui/articles";
import { Page } from "@repo/ui/pages";
import { URLViewer } from "@repo/ui/url";
import { getLocalizedMessage } from "#lib/localization";
import { getActiveTab } from "#lib/tabs";
//

import styles from "./page.module.scss";

export function HomePage() {
  const url = useLoaderData<typeof loader>();

  return (
    <Page>
      <Overview className={styles.article} headingLevel={2}>
        {() => (
          <>
            <OverviewBody className={styles.body}>
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

export async function loader() {
  const currentTab = await getActiveTab();
  const url = currentTab.url;

  return !url ? url : new URL(url);
}
