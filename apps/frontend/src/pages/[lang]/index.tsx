import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { getStaticExportPaths } from "#server";
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
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { Page } from "#components";
import { Link } from "#components/link";
import { Overview, OverviewHeader } from "#components/overview";
import { List, ListItem } from "#components/list";
import { Heading } from "#components/heading";

import styles from "./index.module.scss";

interface IProps extends ILocalizedProps<"home"> {}

interface IParams extends ILocalizedParams {}

function FrontPage({
  translation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { lang, t } = translation;

  return (
    <Page heading={t.heading} title={t.title}>
      <Overview headingLevel={2}>
        {(headinglevel) => (
          <OverviewHeader className={styles.header}>
            <Heading level={headinglevel + 1}>{t["Tools"]}</Heading>
            <List className={styles.list}>
              <ListItem>
                <DescriptionList>
                  <DescriptionSection
                    dKey={t["Planned events"]}
                    dValue={
                      <List className={styles.list}>
                        <ListItem>
                          <Link
                            className={styles.link}
                            href={createPlannedEventsPageURL(lang, {
                              order: "recently_updated",
                            })}
                          >
                            {t["Recently updated"]}
                          </Link>
                        </ListItem>

                        <ListItem>
                          <Link
                            className={styles.link}
                            href={createPlannedEventsPageURL(lang)}
                          >
                            {t["Recently created"]}
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
                  {t["Places"]}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createTaskStatsPageURL(lang)}
                >
                  {t["Tasks"]}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createQRCodeReaderURL(lang)}
                >
                  {t["QR code reader"]}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createURLViewerPageURL(lang)}
                >
                  {t["URL Viewer"]}
                </Link>
              </ListItem>

              <ListItem>
                <Link className={styles.link} href={createAccountPageURL(lang)}>
                  {t["Account"]}
                </Link>
              </ListItem>
            </List>

            <Heading level={headinglevel + 1}>{t["Miscellaneous"]}</Heading>
            <List className={styles.list}>
              <ListItem>
                <Link
                  className={styles.link}
                  href={createYTDLPConfigPage(lang)}
                >
                  {t["YT-DLP configs"]}
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
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const { home } = dict.pages;
  const props = {
    translation: { lang, common: dict.common, t: home },
  } satisfies IProps;

  return {
    props,
  };
};
export const getStaticPaths = getStaticExportPaths;

export default FrontPage;
