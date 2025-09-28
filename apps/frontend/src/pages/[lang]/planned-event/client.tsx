

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFoundURL } from "#lib/urls";
import type { ILocalizationEntities } from "#lib/localization";
import { useIndexedDB } from "#hooks";
import { OverviewPlaceHolder } from "#components/overview";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import {
  getPlannedEvent,
  type IPlannedEvent,
  PlannetEventOverview,
} from "#entities/planned-event";

interface IProps extends ILocalizableProps, ITranslatableProps {
  translation: ILocalizationEntities["planned_event"];
}

export function Client({ language, commonTranslation, translation }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const runTransaction = useIndexedDB();
  const [plannedEvent, changePlannedEvent] = useState<IPlannedEvent>();
  const plannedEventID = searchParams.get("planned_event_id")?.trim();
  const parsedPlannedEventID = !plannedEventID
    ? undefined
    : parseInt(plannedEventID, 10);

  useEffect(() => {
    if (!parsedPlannedEventID) {
      router.replace(notFoundURL);
      return;
    }

    runTransaction(
      "planned_events",
      "readonly",
      (event) => {
        throw new Error(String(event));
      },
      (transaction) => {
        getPlannedEvent(
          { transaction, id: parsedPlannedEventID },
          (plannedEvent) => changePlannedEvent(plannedEvent),
        );
      },
    );
  }, [parsedPlannedEventID]);

  return !plannedEvent ? (
    <OverviewPlaceHolder headingLevel={2} />
  ) : (
    <PlannetEventOverview
      language={language}
      commonTranslation={commonTranslation}
      translation={translation}
      headingLevel={2}
      plannedEvent={plannedEvent}
    />
  );
}
