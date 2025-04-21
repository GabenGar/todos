"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ILocalizationEntities } from "#lib/localization";
import { createPlannedEventsPageURL } from "#lib/urls";
import type { IPaginatedCollection } from "#lib/pagination";
import { useIndexedDB } from "#hooks";
import { Details, Loading } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { PreviewList } from "#components/preview";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import {
  PlannedEventCreateForm,
  PlannedEventPreview,
  countPlannedEvents,
  createPlannedEvent,
  getPlannedEvents,
  isPlannedEventsOrder,
  type IPlannedEvent,
  type IPlannedEventInit,
} from "#entities/planned-event";

interface IProps extends ILocalizableProps, ITranslatableProps {
  translation: ILocalizationEntities["planned_event"];
}

export function Client({ language, commonTranslation, translation }: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const runTransaction = useIndexedDB();
  const [plannedEvents, changePlannedEvents] =
    useState<IPaginatedCollection<IPlannedEvent>>();
  const [isLoading, switchLoading] = useState(true);
  const inputPage = searchParams.get("page")?.trim();
  const page = !inputPage ? undefined : parseInt(inputPage, 10);
  const inputOrder = searchParams.get("order")?.trim();
  const order = !isPlannedEventsOrder(inputOrder) ? undefined : inputOrder;

  useEffect(() => {
    switchLoading(true);

    runTransaction(
      "planned_events",
      "readonly",
      (event) => {
        switchLoading(false);
        throw new Error(String(event));
      },
      (transaction) => {
        countPlannedEvents({ transaction }, (count) => {
          if (count === 0) {
            switchLoading(false);
            return;
          }

          getPlannedEvents({ transaction, page, order }, (plannedEvents) => {
            if (!page) {
              const url = createPlannedEventsPageURL(language, {
                page: plannedEvents.pagination.totalPages,
                order
              });
              router.replace(url);

              switchLoading(false);
              return;
            }

            changePlannedEvents(plannedEvents);
          });
        });
      },
    );
  }, [page]);

  async function handlePlannedEventCreation(init: IPlannedEventInit) {
    runTransaction(
      "planned_events",
      "readwrite",
      (event) => {
        throw new Error(String(event));
      },
      (transaction) => {
        createPlannedEvent(transaction, init, () => {
          getPlannedEvents({ transaction, page: 0, order }, (newPlannedEvents) => {
            changePlannedEvents(newPlannedEvents);
          });
        });
      },
    );
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

      {isLoading ? (
        <Loading />
      ) : !plannedEvents ? (
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
          buildURL={(page) => createPlannedEventsPageURL(language, { page, order })}
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
