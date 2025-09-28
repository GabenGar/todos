

import { useState, useEffect } from "react";
import type { ILocalizationPage } from "#lib/localization";
import { createPlacesPageURL } from "#lib/urls";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Link } from "#components/link";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import { getPlacesStats } from "#entities/place";

interface IProps extends ILocalizableProps, ITranslatableProps {
  translation: ILocalizationPage["stats_places"];
}

export function PlacesStats({
  language,
  commonTranslation,
  translation,
}: IProps) {
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
            <Link href={createPlacesPageURL(language)}>{stats.all}</Link>
          )
        }
      />
      <DescriptionSection
        isHorizontal
        dKey={translation.stats["Eventless"]}
        dValue={
          !stats ? (
            <Loading />
          ) : stats.eventless === 0 ? (
            <span>{stats.eventless}</span>
          ) : (
            <Link
              href={createPlacesPageURL(language, { category: "eventless" })}
            >
              {stats.eventless}
            </Link>
          )
        }
      />
    </DescriptionList>
  );
}
