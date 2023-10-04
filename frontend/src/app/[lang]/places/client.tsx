"use client";

import { useState, useEffect } from "react";
import type { ILocalization } from "#lib/localization";
import { createPlacesPageURL } from "#lib/urls";
import { Loading } from "#components";
import { Details, DetailsHeader } from "#components/details";
import { PreviewList } from "#components/preview";
import type { ITranslatableProps } from "#components/types";
import {
  IPlaceInit,
  PlaceCreateForm,
  PlacePreview,
  createPlace,
  getAllPlaces,
} from "#entities/place";
import { createPagination } from "#lib/pagination";

interface IProps extends ITranslatableProps {
  translation: ILocalization["place"];
}

export function Client({ commonTranslation, translation }: IProps) {
  const [places, changePlaces] =
    useState<Awaited<ReturnType<typeof getAllPlaces>>>();

  useEffect(() => {
    (async () => {
      const newPlaces = await getAllPlaces();
      changePlaces(newPlaces);
    })();
  }, []);

  async function handlePlaceCreation(init: IPlaceInit) {
    await createPlace(init);

    const newPlaces = await getAllPlaces();
    changePlaces(newPlaces);
  }

  return (
    <>
      <Details headingLevel={2}>
        {(headingLevel) => (
          <DetailsHeader>
            <PlaceCreateForm
              commonTranslation={commonTranslation}
              translation={translation}
              id="create-place"
              onNewPlace={handlePlaceCreation}
            />
          </DetailsHeader>
        )}
      </Details>

      {!places ? (
        <Loading />
      ) : (
        <PreviewList
          pagination={createPagination(places.length)}
          commonTranslation={commonTranslation}
          buildURL={() => createPlacesPageURL()}
        >
          {places.map((place) => (
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
