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
  const title = "404 Not Found";

  return {
    title: `${title} | ${SITE_TITLE}`,
  };
}

/**
 * @TODO lathe with client logic (plus localization)
 */
async function NotFoundPage() {
  return (
    <Page>
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

export default NotFoundPage;
