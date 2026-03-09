import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Page } from "#components";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import { Overview, OverviewHeader } from "#components/overview";
import { usePageTranslation } from "#hooks";
import { getTranslation } from "#lib/internationalization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import {
  createAccountPageURL,
  createPlannedEventsPageURL,
  createQRCodeReaderURL,
  createStatsPlacesPageURL,
  createTaskStatsPageURL,
  createURLEditorPageURL,
  createURLViewerPageURL,
  createYTDLPConfigPage,
} from "#lib/urls";
import { getStaticExportPaths } from "#server";
//

import styles from "./index.module.scss";

interface IProps extends ILocalizedProps {}

interface IParams extends ILocalizedParams {}

function FrontPage({ lang }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-home");
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {(headinglevel) => (
          <OverviewHeader className={styles.header}>
            <Heading level={headinglevel + 1}>{t((t) => t["Tools"])}</Heading>
            <List className={styles.list}>
              <ListItem>
                <DescriptionList>
                  <DescriptionSection
                    dKey={t((t) => t["Planned events"])}
                    dValue={
                      <List className={styles.list}>
                        <ListItem>
                          <Link
                            className={styles.link}
                            href={createPlannedEventsPageURL(lang, {
                              order: "recently_updated",
                            })}
                          >
                            {t((t) => t["Recently updated"])}
                          </Link>
                        </ListItem>

                        <ListItem>
                          <Link
                            className={styles.link}
                            href={createPlannedEventsPageURL(lang)}
                          >
                            {t((t) => t["Recently created"])}
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
                  {t((t) => t["Places"])}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createTaskStatsPageURL(lang)}
                >
                  {t((t) => t["Tasks"])}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createQRCodeReaderURL(lang)}
                >
                  {t((t) => t["QR code reader"])}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createURLViewerPageURL(lang)}
                >
                  {t((t) => t["URL Viewer"])}
                </Link>
              </ListItem>

              <ListItem>
                <Link
                  className={styles.link}
                  href={createURLEditorPageURL(lang)}
                >
                  {t((t) => t["URL Editor"])}
                </Link>
              </ListItem>

              <ListItem>
                <Link className={styles.link} href={createAccountPageURL(lang)}>
                  {t((t) => t["Account"])}
                </Link>
              </ListItem>
            </List>

            <Heading level={headinglevel + 1}>
              {t((t) => t["Miscellaneous"])}
            </Heading>
            <List className={styles.list}>
              <ListItem>
                <Link
                  className={styles.link}
                  href={createYTDLPConfigPage(lang)}
                >
                  {t((t) => t["YT-DLP configs"])}
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
  // biome-ignore lint/style/noNonNullAssertion: blah
  const { lang } = params!;
  const translation = await getTranslation(lang, "page-home");
  const props = {
    lang,
    translation,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default FrontPage;
