import { SITE_TITLE } from "#environment";
import {
  createQRCodeReaderURL,
  createAccountPageURL,
  createPlannedEventsPageURL,
  createStatsPlacesPageURL,
  createTaskStatsPageURL,
  createURLViewerPageURL,
  createYTDLPConfigPage,
} from "#lib/urls";
import { getDictionary } from "#server";
import type { IStaticPageProps } from "#pages/types";
import { Page } from "#components";
import { Link } from "#components/link";
import { Overview, OverviewHeader } from "#components/overview";
import { List, ListItem } from "#components/list";
import { Heading } from "#components/heading";

import styles from "./page.module.scss";

interface IProps extends IStaticPageProps {}

export async function generateMetadata({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { home } = dict.pages;

  return {
    title: `${home.title} | ${SITE_TITLE}`,
  };
}

async function FrontPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { home } = dict.pages;

  return (
    <Page heading={home.heading}>
      <Overview headingLevel={2}>
        {(headinglevel) => (
          <OverviewHeader className={styles.header}>
            <Heading level={headinglevel + 1}>{home["Tools"]}</Heading>
            <List className={styles.list}>
              <ListItem>
                <Link
                  className={styles.link}
                  href={createPlannedEventsPageURL(lang)}
                >
                  {home["Planned events"]}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createStatsPlacesPageURL(lang)}
                >
                  {home["Places"]}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createTaskStatsPageURL(lang)}
                >
                  {home["Tasks"]}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createQRCodeReaderURL(lang)}
                >
                  {home["QR code reader"]}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createURLViewerPageURL(lang)}
                >
                  {home["URL Viewer"]}
                </Link>
              </ListItem>

              <ListItem>
                <Link className={styles.link} href={createAccountPageURL(lang)}>
                  {home["Account"]}
                </Link>
              </ListItem>
            </List>

            <Heading level={headinglevel + 1}>{home["Miscellaneous"]}</Heading>
            <List className={styles.list}>
              <ListItem>
                <Link
                  className={styles.link}
                  href={createYTDLPConfigPage(lang)}
                >
                  {home["YT-DLP configs"]}
                </Link>
              </ListItem>
            </List>
          </OverviewHeader>
        )}
      </Overview>
    </Page>
  );
}

export default FrontPage;
