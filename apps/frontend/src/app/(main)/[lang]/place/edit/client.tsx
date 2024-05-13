"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPlacePageURL } from "#lib/urls";
import { Loading } from "#components";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import { Overview, OverviewBody, OverviewHeader } from "#components/overview";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import {
  EditPlaceForm,
  type IEditPlaceFormProps,
  editPlace,
  getPlace,
} from "#entities/place";

interface IProps
  extends ITranslatableProps,
    ILocalizableProps,
    Pick<IEditPlaceFormProps, "translation"> {}

export function Client({ language, commonTranslation, translation }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPlace, changePlace] =
    useState<Awaited<ReturnType<typeof getPlace>>>();
  const inputPlaceID = searchParams.get("place_id")?.trim();
  // consider an empty string as `undefined`
  const placeID = !inputPlaceID?.length ? undefined : inputPlaceID;

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
    <Overview headingLevel={2}>
      {(headingLevel) => (
        <>
          <OverviewHeader>
            <List>
              <ListItem>
                {!currentPlace ? (
                  <Loading />
                ) : (
                  <Link href={createPlacePageURL(language, currentPlace.id)}>
                    {translation["Place"]}
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
          </OverviewBody>
        </>
      )}
    </Overview>
  );
}
