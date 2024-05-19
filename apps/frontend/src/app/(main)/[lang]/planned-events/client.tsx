"use client";

import { useState, useEffect } from "react";
import type { ILocalizationEntities } from "#lib/localization";
import { createPlannedEventsPageURL } from "#lib/urls";
import { Details, Loading } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { PreviewList } from "#components/preview";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import {
  PlannedEventCreateForm,
  PlannedEventPreview,
  createPlannedEvent,
  getPlannedEvents,
  type IPlannedEventInit,
} from "#entities/planned-event";

interface IProps extends ILocalizableProps, ITranslatableProps {
  translation: ILocalizationEntities["planned_event"];
}

export function Client({ language, commonTranslation, translation }: IProps) {
  const [plannedEvents, changePlannedEvents] =
    useState<Awaited<ReturnType<typeof getPlannedEvents>>>();

  useEffect(() => {
    (async () => {
      const newPlannedEvents = await getPlannedEvents();

      changePlannedEvents(newPlannedEvents);
    })();
  }, []);

  async function handlePlannedEventCreation(init: IPlannedEventInit) {
    await createPlannedEvent(init);

    const newPlannedEvents = await getPlannedEvents();

    changePlannedEvents(newPlannedEvents);
  }

  return (
    <>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <OverviewHeader>
            <Details summary={translation["Add planned event"]}>
              <PlannedEventCreateForm
                commonTranslation={commonTranslation}
                translation={translation}
                id="create-planned-event"
                onNewPlannedEvent={handlePlannedEventCreation}
              />
            </Details>
          </OverviewHeader>
        )}
      </Overview>

      {!plannedEvents ? (
        <Loading />
      ) : plannedEvents.length === 0 ? (
        <Overview headingLevel={2}>
          {() => (
            <OverviewHeader>
              {translation["No planned events found"]}
            </OverviewHeader>
          )}
        </Overview>
      ) : (
        <PreviewList
          pagination={{
            totalCount: plannedEvents.length,
            limit: plannedEvents.length,
            totalPages: 1,
            currentPage: 1,
            offset: 0,
            currentMin: 1,
            currentMax: plannedEvents.length,
          }}
          commonTranslation={commonTranslation}
          sortingOrder="descending"
          buildURL={(page) => createPlannedEventsPageURL(language)}
        >
          {plannedEvents.map((place) => (
            <PlannedEventPreview
              language={language}
              commonTranslation={commonTranslation}
              translation={translation}
              headingLevel={2}
              key={place.id}
              plannedEvent={place}
            />
          ))}
        </PreviewList>
      )}
    </>
  );
}
