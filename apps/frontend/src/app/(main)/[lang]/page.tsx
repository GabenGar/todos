import { SITE_TITLE } from "#environment";
import {
  creatQRCodeReaderURL,
  createAccountPageURL,
  createStatsPlacesPageURL,
  createTaskStatsPageURL,
  createURLViewerPageURL,
} from "#lib/urls";
import { getDictionary } from "#server";
import type { IStaticPageProps } from "#pages/types";
import { Page } from "#components";
import { Link } from "#components/link";
import { Overview, OverviewHeader } from "#components/overview";
import { List, ListItem } from "#components/list";

import styles from "./page.module.scss";

interface IProps extends IStaticPageProps {}

export async function generateMetadata({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { home } = dict;

  return {
    title: `${home.title} | ${SITE_TITLE}`,
  };
}

async function FrontPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { home } = dict;

  return (
    <Page heading={home.heading}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader className={styles.header}>
            <List className={styles.list}>
              <ListItem>
                <Link
                  className={styles.link}
                  href={createStatsPlacesPageURL(lang)}
                >
                  {home.link_places}
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  className={styles.link}
                  href={createTaskStatsPageURL(lang)}
                >
                  {home.link_tasks}
                </Link>
              </ListItem>
              <ListItem>
                <Link className={styles.link} href={creatQRCodeReaderURL(lang)}>
                  {home.link_qr_code}
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  className={styles.link}
                  href={createURLViewerPageURL(lang)}
                >
                  {home.link_url_viewer}
                </Link>
              </ListItem>
              <ListItem>
                <Link className={styles.link} href={createAccountPageURL(lang)}>
                  {home.link_account}
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
