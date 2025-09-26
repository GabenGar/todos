import type { ParsedUrlQuery } from "node:querystring";
import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import {
  createQRCodeReaderURL,
  createAccountPageURL,
  createPlannedEventsPageURL,
  createStatsPlacesPageURL,
  createTaskStatsPageURL,
  createURLViewerPageURL,
  createYTDLPConfigPage,
} from "#lib/urls";
import { getDictionary } from "#lib/localization";
import { LOCALES, type ILocale } from "#lib/internationalization";
import { Page } from "#components";
import { Link } from "#components/link";
import { Overview, OverviewHeader } from "#components/overview";
import { List, ListItem } from "#components/list";
import { Heading } from "#components/heading";

import styles from "./index.module.scss";

interface IProps {
  le: string;
}

interface IParams extends ParsedUrlQuery {
  lang: ILocale;
}

async function FrontPage({}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { home } = dict.pages;

  return (
    <Page heading={home.heading} title={home.title}>
      <Overview headingLevel={2}>
        {(headinglevel) => (
          <OverviewHeader className={styles.header}>
            <Heading level={headinglevel + 1}>{home["Tools"]}</Heading>
            <List className={styles.list}>
              <ListItem>
                <DescriptionList>
                  <DescriptionSection
                    dKey={home["Planned events"]}
                    dValue={
                      <List className={styles.list}>
                        <ListItem>
                          <Link
                            className={styles.link}
                            href={createPlannedEventsPageURL(lang, {
                              order: "recently_updated",
                            })}
                          >
                            {home["Recently updated"]}
                          </Link>
                        </ListItem>

                        <ListItem>
                          <Link
                            className={styles.link}
                            href={createPlannedEventsPageURL(lang)}
                          >
                            {home["Recently created"]}
                          </Link>
                        </ListItem>
                      </List>
                    }
                  />
                </DescriptionList>
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

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const props = { le: "le" } satisfies IProps;

  return {
    props,
  };
};
export const getStaticPaths: GetStaticPaths<IParams> = async () => {
  const paths = LOCALES.map((locale) => {
    return { params: { lang: locale } };
  });
  const result = {
    paths,
    fallback: false,
  } satisfies GetStaticPathsResult<IParams>;

  return result;
};

export default FrontPage;
