"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPlacePageURL } from "#lib/urls";
import { Loading } from "#components";
import type { ITranslatableProps } from "#components/types";
import { Details, DetailsBody, DetailsHeader } from "#components/details";
import { Link } from "#components/link";
import {
  EditPlaceForm,
  type IEditPlaceFormProps,
  editPlace,
  getPlace,
} from "#entities/place";

interface IProps
  extends ITranslatableProps,
    Pick<IEditPlaceFormProps, "translation"> {}

export function Client({ commonTranslation, translation }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPlace, changePlace] =
    useState<Awaited<ReturnType<typeof getPlace>>>();
  const placeID = searchParams.get("place_id")?.trim();

  useEffect(() => {
    if (!placeID) {
      router.replace("/404");
      return;
    }

    (async () => {
      const task = await getPlace(placeID);
      changePlace(task);
    })();
  }, [placeID]);

  return (
    <Details headingLevel={2}>
      {(headingLevel) => (
        <>
          <DetailsHeader>
            <ul>
              <li>
                {!currentPlace ? (
                  <Loading />
                ) : (
                  <Link href={createPlacePageURL(currentPlace.id)}>
                    {translation["Place"]}
                  </Link>
                )}
              </li>
            </ul>
          </DetailsHeader>

          <DetailsBody>
            {!currentPlace ? (
              <Loading />
            ) : (
              <EditPlaceForm
                commonTranslation={commonTranslation}
                translation={translation}
                id={`edit-place-${currentPlace.id}`}
                currentPlace={currentPlace}
                onPlaceEdit={async (placeUpdate) => {
                  const editedTask = await editPlace(placeUpdate);

                  changePlace(editedTask);
                }}
              />
            )}
          </DetailsBody>
        </>
      )}
    </Details>
  );
}
