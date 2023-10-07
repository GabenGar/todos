"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ILocalization } from "#lib/localization";
import { createPlacesPageURL } from "#lib/urls";
import { Loading } from "#components";
import { Details, DetailsHeader } from "#components/details";
import { PreviewList } from "#components/preview";
import type { ITranslatableProps } from "#components/types";
import { Button } from "#components/button";
import {
  type IPlaceInit,
  PlaceCreateForm,
  PlacePreview,
  createPlace,
  getPlaces,
} from "#entities/place";

interface IProps extends ITranslatableProps {
  translation: ILocalization["place"];
}

export function Client({ commonTranslation, translation }: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAddFormShown, switchAddForm] = useState(false);
  const [places, changePlaces] =
    useState<Awaited<ReturnType<typeof getPlaces>>>();
  const inputPage = searchParams.get("page")?.trim();
  const page = !inputPage ? undefined : parseInt(inputPage, 10);

  useEffect(() => {
    (async () => {
      const newPlaces = await getPlaces({ page });

      if (page !== newPlaces.pagination.currentPage) {
        const url = createPlacesPageURL({
          page: newPlaces.pagination.currentPage,
        });
        router.replace(url);
        return;
      }

      changePlaces(newPlaces);
    })();
  }, [page]);

  async function handlePlaceCreation(init: IPlaceInit) {
    await createPlace(init);

    const newPlaces = await getPlaces();

    if (places?.pagination.totalPages !== newPlaces.pagination.totalPages) {
      const url = createPlacesPageURL({
        page: newPlaces.pagination.totalPages,
      });
      router.replace(url);
      return;
    }

    changePlaces(newPlaces);
  }

  return (
    <>
      <Details headingLevel={2}>
        {(headingLevel) => (
          <DetailsHeader>
            <Button onClick={() => switchAddForm((value) => !value)}>
              {translation.add}
            </Button>
            {isAddFormShown && (
              <PlaceCreateForm
                commonTranslation={commonTranslation}
                translation={translation}
                id="create-place"
                onNewPlace={handlePlaceCreation}
              />
            )}
          </DetailsHeader>
        )}
      </Details>

      {!places ? (
        <Loading />
      ) : (
        <PreviewList
          pagination={places.pagination}
          commonTranslation={commonTranslation}
          sortingOrder="descending"
          buildURL={(page) => createPlacesPageURL({ page })}
        >
          {places.items.map((place) => (
            <PlacePreview
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
