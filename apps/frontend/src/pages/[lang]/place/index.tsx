import { useEffect, useState } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { getDictionary, type ILocalization } from "#lib/localization";
import {
  getSingleValueFromQuery,
  type ILocalizedParams,
  type ILocalizedProps,
} from "#lib/pages";
import { notFoundURL } from "#lib/urls";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { OverviewPlaceHolder } from "#components/overview";
import { PlaceOverview, type IPlace, getPlace } from "#entities/place";

interface IProps extends ILocalizedProps<"place"> {
  taskTranslation: ILocalization["stats_tasks"];
  placeTranslation: ILocalization["place"];
}

interface IParams extends ILocalizedParams {}

function PlaceDetailsPage({
  translation,
  taskTranslation,
  placeTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { isReady, query } = router;
  const [place, changePlace] = useState<IPlace>();
  const { lang, common, t } = translation;
  const title = t.title;
  const placeID = getSingleValueFromQuery(query, "place_id");

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!placeID) {
      router.replace(notFoundURL);
      return;
    }

    (async () => {
      const newPlace = await getPlace(placeID);
      changePlace(newPlace);
    })();
  }, [isReady, placeID]);

  return (
    <Page heading={t.heading} title={title}>
      {!place ? (
        <OverviewPlaceHolder headingLevel={2} />
      ) : (
        <PlaceOverview
          language={lang}
          commonTranslation={common}
          translation={placeTranslation}
          taskTranslation={taskTranslation}
          headingLevel={2}
          place={place}
        />
      )}
    </Page>
  );
}

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const { place } = dict.pages;
  const props = {
    translation: { lang, common: dict.common, t: place },
    taskTranslation: dict.stats_tasks,
    placeTranslation: dict.place,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default PlaceDetailsPage;
