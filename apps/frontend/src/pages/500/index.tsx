import type { ReactNode } from "react";
import { Page } from "#components";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "#components/overview";
import { RootLayout } from "#components/pages/layouts";
//

import styles from "./index.module.scss";

/**
 * @TODO lathe with client logic (plus localization)
 */
async function ServerErrorPage() {
  const title = "500 Internal Server Error";

  return (
    <Page title={title}>
      <Overview headingLevel={2}>
        {(headinglevel) => (
          <>
            <OverviewHeader className={styles.header}>
              <Heading level={headinglevel}>500 Internal Server Error</Heading>
            </OverviewHeader>

            <OverviewBody>
              <p>There is an error on the server.</p>
            </OverviewBody>

            <OverviewFooter>
              <Link href={"/"}>Return home</Link>
            </OverviewFooter>
          </>
        )}
      </Overview>
    </Page>
  );
}

ServerErrorPage.getLayout = (page: ReactNode) => {
  return <RootLayout>{page}</RootLayout>;
};

export default ServerErrorPage;
