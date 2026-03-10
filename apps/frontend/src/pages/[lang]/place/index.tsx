import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Page } from "#components";
import { OverviewPlaceHolder } from "#components/overview";
import { getPlace, type IPlace, PlaceOverview } from "#entities/place";
import { usePageTranslation } from "#hooks";
import { getSingleValueFromQuery } from "#lib/pages";
import { notFoundURL } from "#lib/urls";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function PlaceDetailsPage({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-place");
  const router = useRouter();
  const { isReady, query } = router;
  const [place, changePlace] = useState<IPlace>();
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);
  const placeID = getSingleValueFromQuery(query, "place_id");

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
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
    <Page heading={heading} title={title}>
      {!place ? (
        <OverviewPlaceHolder headingLevel={2} />
      ) : (
        <PlaceOverview
          language={lang}
          headingLevel={2}
          place={place}
        />
      )}
    </Page>
  );
}

export const getStaticProps = createGetStaticProps("page-place");
export const getStaticPaths = getStaticExportPaths;

export default PlaceDetailsPage;
