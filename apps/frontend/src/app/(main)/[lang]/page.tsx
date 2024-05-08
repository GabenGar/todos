import { SITE_TITLE } from "#environment";
import {
  accountPageURL,
  qrCodeReaderURL,
  statsPlacesPageURL,
  taskStatsPageURL,
  urlViewerPageURL,
} from "#lib/urls";
import { getDictionary } from "#server";
import type { IStaticPageProps } from "#pages/types";
import { Page } from "#components";
import { Link } from "#components/link";
import { Details, DetailsHeader } from "#components/details";
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
      <Details headingLevel={2}>
        {() => (
          <DetailsHeader className={styles.header}>
            <List className={styles.list}>
              <ListItem>
                <Link className={styles.link} href={statsPlacesPageURL}>
                  {home.link_places}
                </Link>
              </ListItem>
              <ListItem>
                <Link className={styles.link} href={taskStatsPageURL}>
                  {home.link_tasks}
                </Link>
              </ListItem>
              <ListItem>
                <Link className={styles.link} href={qrCodeReaderURL}>
                  {home.link_qr_code}
                </Link>
              </ListItem>
              <ListItem>
                <Link className={styles.link} href={urlViewerPageURL}>
                  {home.link_url_viewer}
                </Link>
              </ListItem>
              <ListItem>
                <Link className={styles.link} href={accountPageURL}>
                  {home.link_account}
                </Link>
              </ListItem>
            </List>
          </DetailsHeader>
        )}
      </Details>
    </Page>
  );
}

export default FrontPage;
