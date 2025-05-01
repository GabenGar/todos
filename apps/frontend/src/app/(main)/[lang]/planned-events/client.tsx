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
  SearchPlannedEventForm,
  countPlannedEvents,
  createPlannedEvent,
  getPlannedEvents,
  isPlannedEventsOrder,
  type IPlannedEvent,
  type IPlannedEventInit,
  type IPlannedEventSearchQuery,
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
      (error) => {
        switchLoading(false);
        throw error;
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
                order,
              });
              router.replace(url);

              switchLoading(false);
              return;
            }

            changePlannedEvents(plannedEvents);
            switchLoading(false);
          });
        });
      },
    );
  }, [page]);

  async function handlePlannedEventCreation(init: IPlannedEventInit) {
    await new Promise<void>((resolve, reject) =>
      runTransaction(
        "planned_events",
        "readwrite",
        (error) => {
          reject(error);
        },
        (transaction) => {
          createPlannedEvent(transaction, init, () => {
            getPlannedEvents({ transaction, order }, (newPlannedEvents) => {
              changePlannedEvents(newPlannedEvents);
              resolve();
            });
          });
        },
      ),
    );
    return;
  }

  async function handlePlannedEventsSearch({
    order,
  }: IPlannedEventSearchQuery) {
    await new Promise<void>((resolve, reject) =>
      runTransaction(
        "planned_events",
        "readonly",
        (error) => {
          reject(error);
        },
        (transaction) => {
          countPlannedEvents({ transaction }, (count) => {
            if (count === 0) {
              reject(new Error(translation["No planned events found"]));

              return;
            }

            getPlannedEvents({ transaction, page, order }, (plannedEvents) => {
              const url = createPlannedEventsPageURL(language, {
                page: plannedEvents.pagination.totalPages,
                order,
              });

              router.replace(url);
              resolve();

              return;
            });
          });
        },
      ),
    );

    return;
  }

  return (
    <>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <OverviewHeader>
            <Details summary={translation["Filter"]}>
              <SearchPlannedEventForm
                key={order}
                commonTranslation={commonTranslation}
                translation={translation}
                id="search-planned-event"
                onSearch={handlePlannedEventsSearch}
                defaultOrder={order}
              />
            </Details>

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
          buildURL={(page) =>
            createPlannedEventsPageURL(language, { page, order })
          }
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
