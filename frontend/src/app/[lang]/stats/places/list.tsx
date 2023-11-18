"use client";

import { useState, useEffect } from "react";
import type { ILocalizationPage } from "#lib/localization";
import { createPlacesPageURL } from "#lib/urls";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Link } from "#components/link";
import type { ITranslatableProps } from "#components/types";
import { getPlacesStats } from "#entities/place";

interface IProps extends ITranslatableProps {
  translation: ILocalizationPage["stats_places"];
}

export function PlacesStats({ commonTranslation, translation }: IProps) {
  const [stats, changeStats] =
    useState<Awaited<ReturnType<typeof getPlacesStats>>>();
  useEffect(() => {
    (async () => {
      const newStats = await getPlacesStats();
      changeStats(newStats);
    })();
  }, []);

  return (
    <DescriptionList>
      <DescriptionSection
        isHorizontal
        dKey={translation.stats["All"]}
        dValue={
          !stats ? (
            <Loading />
          ) : (
            <Link href={createPlacesPageURL()}>{stats.all}</Link>
          )
        }
      />
    </DescriptionList>
  );
}
