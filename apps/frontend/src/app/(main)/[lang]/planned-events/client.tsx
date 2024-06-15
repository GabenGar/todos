"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plannedEvents, changePlannedEvents] =
    useState<Awaited<ReturnType<typeof getPlannedEvents>>>();
  const inputPage = searchParams.get("page")?.trim();
  const page = !inputPage ? undefined : parseInt(inputPage, 10);

  useEffect(() => {
    (async () => {
      const newPlannedEvents = await getPlannedEvents(page);

      if (!page) {
        const url = createPlannedEventsPageURL(language, {
          page: newPlannedEvents.pagination.totalPages,
        });
        router.replace(url);

        return;
      }

      changePlannedEvents(newPlannedEvents);
    })();
  }, [page]);

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
      ) : plannedEvents.pagination.totalCount === 0 ? (
        <Overview headingLevel={2}>
          {() => (
            <OverviewHeader>
              {translation["No planned events found"]}
            </OverviewHeader>
          )}
        </Overview>
      ) : (
        <PreviewList
          pagination={plannedEvents.pagination}
          commonTranslation={commonTranslation}
          sortingOrder="descending"
          buildURL={(page) => createPlannedEventsPageURL(language, { page })}
        >
          {plannedEvents.items.map((plannedEvent) => (
            <PlannedEventPreview
              language={language}
              commonTranslation={commonTranslation}
              translation={translation}
              headingLevel={2}
              key={plannedEvent.id}
              plannedEvent={plannedEvent}
            />
          ))}
        </PreviewList>
      )}
    </>
  );
}
