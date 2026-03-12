import type { InferGetStaticPropsType } from "next";
import { useEffect, useState } from "react";
import {
  DescriptionList,
  DescriptionSection,
  Loading,
  Page,
} from "#components";
import { Link } from "#components/link";
import { Overview, OverviewHeader } from "#components/overview";
import { getPlacesStats } from "#entities/place";
import { usePageTranslation } from "#hooks";
import { createPlacesPageURL } from "#lib/urls";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function PlacesStatsPage({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-stats-places");
  const [stats, changeStats] =
    useState<Awaited<ReturnType<typeof getPlacesStats>>>();
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);
  const description = t((t) => t.description);

  useEffect(() => {
    (async () => {
      const newStats = await getPlacesStats();
      changeStats(newStats);
    })();
  }, []);

  return (
    <Page heading={heading} title={title} description={description}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <DescriptionList>
              <DescriptionSection
                isHorizontal
                dKey={t((t) => t.stats["All"])}
                dValue={
                  !stats ? (
                    <Loading />
                  ) : (
                    <Link href={createPlacesPageURL(lang)}>{stats.all}</Link>
                  )
                }
              />
              <DescriptionSection
                isHorizontal
                dKey={t((t) => t.stats["Eventless"])}
                dValue={
                  !stats ? (
                    <Loading />
                  ) : stats.eventless === 0 ? (
                    <span>{stats.eventless}</span>
                  ) : (
                    <Link
                      href={createPlacesPageURL(lang, {
                        category: "eventless",
                      })}
                    >
                      {stats.eventless}
                    </Link>
                  )
                }
              />
            </DescriptionList>
          </OverviewHeader>
        )}
      </Overview>
    </Page>
  );
}

export const getStaticProps = createGetStaticProps("page-stats-places");

export const getStaticPaths = getStaticExportPaths;

export default PlacesStatsPage;
