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

import styles from "./404.module.scss";

/**
 * @TODO lathe with client logic (plus localization)
 */
function NotFoundPage() {
  const title = "404 Not Found";

  return (
    <Page title={title}>
      <Overview headingLevel={2}>
        {(headinglevel) => (
          <>
            <OverviewHeader className={styles.header}>
              <Heading level={headinglevel}>404 Not Found</Heading>
            </OverviewHeader>

            <OverviewBody>
              <p>This page does not exist.</p>
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

NotFoundPage.getLayout = (page: ReactNode) => {
  return <RootLayout>{page}</RootLayout>;
};

export default NotFoundPage;
