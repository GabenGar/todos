import type { Metadata } from "next";
import { SITE_TITLE } from "#environment";
import { Page } from "#components";
import { Heading } from "#components/heading";
import {
  Overview,
  OverviewHeader,
  OverviewBody,
  OverviewFooter,
} from "#components/overview";
import { Link } from "#components/link";

import styles from "./page.module.scss";

export async function generateMetadata(): Promise<Metadata> {
  const title = "500 Internal Server Error";

  return {
    title: `${title} | ${SITE_TITLE}`,
  };
}

/**
 * @TODO lathe with client logic (plus localization)
 */
async function ServerErrorPage() {
  return (
    <Page>
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

export default ServerErrorPage;
