import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Details, Loading, Page } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { PreviewList } from "#components/preview";
import {
  createPlace,
  getPlaces,
  type IPlaceInit,
  type IPlaceSearchQuery,
  isPlaceCategory,
  PlaceCreateForm,
  PlacePreview,
  SearchPlacesForm,
} from "#entities/place";
import { usePageTranslation, useTranslation } from "#hooks";
import { getSingleValueFromQuery } from "#lib/pages";
import { createPlacesPageURL } from "#lib/urls";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function PlacesPage({ lang }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-places");
  const { t: otherT } = useTranslation("translation");
  const router = useRouter();
  const [places, changePlaces] =
    useState<Awaited<ReturnType<typeof getPlaces>>>();
  const { isReady, query: pathQuery } = router;
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
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
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <Details summary={otherT((t) => t.place.add)}>
              <PlaceCreateForm
                id="create-place"
                onNewPlace={handlePlaceCreation}
              />
            </Details>

            <Details
              summary={otherT(t => t.place.search["Search"])}
              open={Boolean(query)}
            >
              <SearchPlacesForm
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
              {otherT(t => t.place["No places found"])}
            </OverviewHeader>
          )}
        </Overview>
      ) : (
        <PreviewList
          pagination={places.pagination}
          sortingOrder="descending"
          buildURL={(page) => createPlacesPageURL(lang, { ...options, page })}
        >
          {places.items.map((place) => (
            <PlacePreview
              language={lang}
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

export const getStaticProps = createGetStaticProps("page-places");
export const getStaticPaths = getStaticExportPaths;

export default PlacesPage;
