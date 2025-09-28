

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFoundURL } from "#lib/urls";
import { OverviewPlaceHolder } from "#components/overview";
import {
  type IPlaceOverviewProps,
  PlaceOverview,
  type IPlace,
  getPlace,
} from "#entities/place";

interface IProps
  extends Pick<
    IPlaceOverviewProps,
    "language" | "commonTranslation" | "translation" | "taskTranslation"
  > {}

export function Client({
  language,
  commonTranslation,
  translation,
  taskTranslation,
}: IProps) {
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
    <OverviewPlaceHolder headingLevel={2} />
  ) : (
    <PlaceOverview
      language={language}
      commonTranslation={commonTranslation}
      translation={translation}
      taskTranslation={taskTranslation}
      headingLevel={2}
      place={place}
    />
  );
}
