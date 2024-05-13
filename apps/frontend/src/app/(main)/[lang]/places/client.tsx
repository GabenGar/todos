"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ILocalization } from "#lib/localization";
import { createPlacesPageURL } from "#lib/urls";
import { Details, Loading } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { PreviewList } from "#components/preview";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
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

interface IProps extends ILocalizableProps, ITranslatableProps {
  translation: ILocalization["place"];
}

export function Client({ language, commonTranslation, translation }: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [places, changePlaces] =
    useState<Awaited<ReturnType<typeof getPlaces>>>();
  const inputPage = searchParams.get("page")?.trim();
  const page = !inputPage ? undefined : parseInt(inputPage, 10);
  const inputCategory = searchParams.get("category")?.trim();
  const category =
    !inputCategory || !isPlaceCategory(inputCategory)
      ? undefined
      : inputCategory;
  const inputQuery = searchParams.get("query")?.trim();
  const query = !inputQuery ? undefined : inputQuery;
  const options = {
    page,
    category,
    query,
  };

  useEffect(() => {
    (async () => {
      const newPlaces = await getPlaces(options);

      if (
        newPlaces.pagination.currentPage !== 0 &&
        page !== newPlaces.pagination.currentPage
      ) {
        const url = createPlacesPageURL(language, {
          ...options,
          page: newPlaces.pagination.currentPage,
        });
        router.replace(url);
        return;
      }

      changePlaces(newPlaces);
    })();
  }, [page, category, query]);

  async function handlePlaceCreation(init: IPlaceInit) {
    await createPlace(init);

    const newPlaces = await getPlaces(options);

    if (places?.pagination.totalPages !== newPlaces.pagination.totalPages) {
      const url = createPlacesPageURL(language, {
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

    const newURL = createPlacesPageURL(language, {
      ...options,
      page: pagination.currentPage,
      query,
    });

    router.replace(newURL);
  }

  return (
    <>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <OverviewHeader>
            <Details summary={translation.add}>
              <PlaceCreateForm
                commonTranslation={commonTranslation}
                translation={translation}
                id="create-place"
                onNewPlace={handlePlaceCreation}
              />
            </Details>

            <Details
              summary={translation.search["Search"]}
              open={Boolean(query)}
            >
              <SearchPlacesForm
                commonTranslation={commonTranslation}
                translation={translation}
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
            <OverviewHeader>{translation["No places found"]}</OverviewHeader>
          )}
        </Overview>
      ) : (
        <PreviewList
          pagination={places.pagination}
          commonTranslation={commonTranslation}
          sortingOrder="descending"
          buildURL={(page) =>
            createPlacesPageURL(language, { ...options, page })
          }
        >
          {places.items.map((place) => (
            <PlacePreview
              language={language}
              commonTranslation={commonTranslation}
              translation={translation}
              headingLevel={2}
              key={place.id}
              place={place}
            />
          ))}
        </PreviewList>
      )}
    </>
  );
}
