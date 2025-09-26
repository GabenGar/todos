import type { ReactNode } from "react";
import { Page } from "#components";
import { RootLayout } from "#components/pages/layouts";
import { Heading } from "#components/heading";
import {
  Overview,
  OverviewHeader,
  OverviewBody,
  OverviewFooter,
} from "#components/overview";
import { Link } from "#components/link";

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
