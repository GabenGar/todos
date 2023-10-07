"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFoundURL } from "#lib/urls";
import {
  type IPlaceDetailsProps,
  PlaceDetails,
  IPlace,
  getPlace,
} from "#entities/place";
import { DetailsPlaceHolder } from "#components/details";

interface IProps extends Pick<IPlaceDetailsProps, "translation"> {}

export function Client({ translation }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [place, changePlace] = useState<IPlace>();
  const placeID = searchParams.get("place_id")?.trim();

  useEffect(() => {
    if (!placeID) {
      router.replace(notFoundURL);
      return;
    }

    (async () => {
      const newPlace = await getPlace(placeID);
      changePlace(newPlace);
    })();
  }, [placeID]);

  return !place ? (
    <DetailsPlaceHolder headingLevel={2} />
  ) : (
    <PlaceDetails translation={translation} headingLevel={2} place={place} />
  );
}
