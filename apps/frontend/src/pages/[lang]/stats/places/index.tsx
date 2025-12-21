import { useState, useEffect } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { getDictionary } from "#lib/localization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { createPlacesPageURL } from "#lib/urls";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Link } from "#components/link";
import { getPlacesStats } from "#entities/place";

interface IProps extends ILocalizedProps<"stats_places"> {}

interface IParams extends ILocalizedParams {}

function PlacesStatsPage({
  translation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { lang, t } = translation;
  const title = t.title;
  const description = t.description;
  const [stats, changeStats] =
    useState<Awaited<ReturnType<typeof getPlacesStats>>>();

  useEffect(() => {
    (async () => {
      const newStats = await getPlacesStats();
      changeStats(newStats);
    })();
  }, []);

  return (
    <Page heading={t.heading} title={title} description={description}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <DescriptionList>
              <DescriptionSection
                isHorizontal
                dKey={t.stats["All"]}
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
                dKey={t.stats["Eventless"]}
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

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const props = {
    translation: {
      lang,
      common: dict.common,
      t: dict.pages["stats_places"],
    },
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default PlacesStatsPage;
