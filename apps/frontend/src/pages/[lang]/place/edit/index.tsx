import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading, Page } from "#components";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { EditPlaceForm, editPlace, getPlace } from "#entities/place";
import { getDictionary, type ILocalization } from "#lib/localization";
import {
  getSingleValueFromQuery,
  type ILocalizedParams,
  type ILocalizedProps,
} from "#lib/pages";
import { createPlacePageURL } from "#lib/urls";
import { getStaticExportPaths } from "#server";

interface IProps extends ILocalizedProps<"place_edit"> {
  placeTranslation: ILocalization["place"];
}

interface IParams extends ILocalizedParams {}

function PlaceEditPage({
  translation,
  placeTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [currentPlace, changePlace] =
    useState<Awaited<ReturnType<typeof getPlace>>>();
  const { isReady, query } = router;
  const { lang, common, t } = translation;
  const placeID = getSingleValueFromQuery(query, "place_id");

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!placeID) {
      router.replace("/404");
      return;
    }

    (async () => {
      const task = await getPlace(placeID);
      changePlace(task);
    })();
  }, [isReady, placeID]);

  return (
    <Page heading={t.heading} title={t.title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <List>
                <ListItem>
                  {!currentPlace ? (
                    <Loading />
                  ) : (
                    <Link href={createPlacePageURL(lang, currentPlace.id)}>
                      {placeTranslation["Place"]}
                    </Link>
                  )}
                </ListItem>
              </List>
            </OverviewHeader>

            <OverviewBody>
              {!currentPlace ? (
                <Loading />
              ) : (
                <EditPlaceForm
                  commonTranslation={common}
                  translation={placeTranslation}
                  id={`edit-place-${currentPlace.id}`}
                  currentPlace={currentPlace}
                  onPlaceEdit={async (placeUpdate) => {
                    const editedTask = await editPlace(placeUpdate);

                    changePlace(editedTask);
                  }}
                />
              )}
            </OverviewBody>
          </>
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
  const dict = await getDictionary(lang);
  const { place } = dict.pages;
  const props = {
    translation: { lang, common: dict.common, t: place },
    placeTranslation: dict.place,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default PlaceEditPage;
