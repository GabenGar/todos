import { useState, useEffect } from "react";
import { type GetStaticProps, type InferGetStaticPropsType } from "next";
import { getDictionary, type ILocalization } from "#lib/localization";
import {
  getSingleValueFromQuery,
  type ILocalizedParams,
  type ILocalizedProps,
} from "#lib/pages";
import { createPlacesPageURL } from "#lib/urls";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { Details, Loading } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { PreviewList } from "#components/preview";
import {
  type IPlaceInit,
  PlaceCreateForm,
  PlacePreview,
  createPlace,
  getPlaces,
  isPlaceCategory,
  SearchPlacesForm,
  type IPlaceSearchQuery,
} from "#entities/place";
import { useRouter } from "next/router";

interface IProps extends ILocalizedProps<"places"> {
  placeTranslation: ILocalization["place"];
}

interface IParams extends ILocalizedParams {}

function PlacesPage({
  translation,
  placeTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [places, changePlaces] =
    useState<Awaited<ReturnType<typeof getPlaces>>>();
  const { isReady, query: pathQuery } = router;
  const { lang, common, t } = translation;
  const title = t.title;
  const inputPage = getSingleValueFromQuery(pathQuery, "page");
  const page = !inputPage ? undefined : parseInt(inputPage, 10);
  const inputCategory = getSingleValueFromQuery(pathQuery, "category");
  const category =
    !inputCategory || !isPlaceCategory(inputCategory)
      ? undefined
      : inputCategory;
  const inputQuery = getSingleValueFromQuery(pathQuery, "query");
  const query = !inputQuery ? undefined : inputQuery;
  const options = {
    page,
    category,
    query,
  };

  useEffect(() => {
    if (!isReady) {
      return;
    }

    (async () => {
      const newPlaces = await getPlaces(options);

      if (
        newPlaces.pagination.currentPage !== 0 &&
        page !== newPlaces.pagination.currentPage
      ) {
        const url = createPlacesPageURL(lang, {
          ...options,
          page: newPlaces.pagination.currentPage,
        });
        router.replace(url);
        return;
      }

      changePlaces(newPlaces);
    })();
  }, [isReady, page, category, query]);

  async function handlePlaceCreation(init: IPlaceInit) {
    await createPlace(init);

    const newPlaces = await getPlaces(options);

    if (places?.pagination.totalPages !== newPlaces.pagination.totalPages) {
      const url = createPlacesPageURL(lang, {
        page: newPlaces.pagination.totalPages,
      });
      router.replace(url);
      return;
    }

    changePlaces(newPlaces);
  }

  async function handlePlaceSearch({ query }: IPlaceSearchQuery) {
    const { pagination } = await getPlaces({
      ...options,
      query,
      page: undefined,
    });

    const newURL = createPlacesPageURL(lang, {
      ...options,
      page: pagination.currentPage,
      query,
    });

    router.replace(newURL);
  }

  return (
    <Page heading={t.heading} title={title}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <OverviewHeader>
            <Details summary={placeTranslation.add}>
              <PlaceCreateForm
                commonTranslation={common}
                translation={placeTranslation}
                id="create-place"
                onNewPlace={handlePlaceCreation}
              />
            </Details>

            <Details
              summary={placeTranslation.search["Search"]}
              open={Boolean(query)}
            >
              <SearchPlacesForm
                commonTranslation={common}
                translation={placeTranslation}
                id="search-places"
                defaultQuery={options}
                onSearch={handlePlaceSearch}
              />
            </Details>
          </OverviewHeader>
        )}
      </Overview>

      {!places ? (
        <Loading />
      ) : places.pagination.totalCount === 0 ? (
        <Overview headingLevel={2}>
          {() => (
            <OverviewHeader>
              {placeTranslation["No places found"]}
            </OverviewHeader>
          )}
        </Overview>
      ) : (
        <PreviewList
          pagination={places.pagination}
          commonTranslation={common}
          sortingOrder="descending"
          buildURL={(page) => createPlacesPageURL(lang, { ...options, page })}
        >
          {places.items.map((place) => (
            <PlacePreview
              language={lang}
              commonTranslation={common}
              translation={placeTranslation}
              headingLevel={2}
              key={place.id}
              place={place}
            />
          ))}
        </PreviewList>
      )}
    </Page>
  );
}

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const { places } = dict.pages;
  const props = {
    translation: { lang, common: dict.common, t: places },
    placeTranslation: dict.place,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default PlacesPage;
