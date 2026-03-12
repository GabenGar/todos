import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Details, Loading, Page } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { PreviewList } from "#components/preview";
import {
  countPlannedEvents,
  createPlannedEvent,
  getPlannedEvents,
  type IPlannedEvent,
  type IPlannedEventInit,
  type IPlannedEventSearchQuery,
  isPlannedEventsOrder,
  PlannedEventCreateForm,
  PlannedEventPreview,
  SearchPlannedEventForm,
} from "#entities/planned-event";
import { useIndexedDB, usePageTranslation, useTranslation } from "#hooks";
import { getSingleValueFromQuery } from "#lib/pages";
import type { IPaginatedCollection } from "#lib/pagination";
import { createPlannedEventsPageURL } from "#lib/urls";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function PlannedEventsPage({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-planned-events");
  const { t: eT } = useTranslation("translation");
  const router = useRouter();
  const runTransaction = useIndexedDB();
  const [plannedEvents, changePlannedEvents] =
    useState<IPaginatedCollection<IPlannedEvent>>();
  const [isLoading, switchLoading] = useState(true);
  const { isReady, query } = router;
  const inputPage = getSingleValueFromQuery(query, "page");
  const page = !inputPage ? undefined : parseInt(inputPage, 10);
  const inputOrder = getSingleValueFromQuery(query, "order");
  const order = !isPlannedEventsOrder(inputOrder) ? undefined : inputOrder;
  const title =
    !isReady || !order || order === "recently_created"
      ? t((t) => t["Recently created planned events"])
      : t((t) => t["Recently updated planned events"]);
  // it has to be this way to avoid hydration errors
  const heading =
    !isReady || !order || order === "recently_created"
      ? t((t) => t["Recently Created Planned Events"])
      : t((t) => t["Recently Updated Planned Events"]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
  useEffect(() => {
    if (!isReady) {
      return;
    }

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
              const url = createPlannedEventsPageURL(lang, {
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
  }, [isReady, page]);

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
              reject(
                new Error(
                  eT((t) => t.planned_event["No planned events found"]),
                ),
              );

              return;
            }

            getPlannedEvents({ transaction, page, order }, (plannedEvents) => {
              const url = createPlannedEventsPageURL(lang, {
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
    <Page title={title} heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <Details summary={eT((t) => t.planned_event["Filter"])}>
              <SearchPlannedEventForm
                key={order}
                id="search-planned-event"
                onSearch={handlePlannedEventsSearch}
                defaultOrder={order}
              />
            </Details>

            <Details summary={eT((t) => t.planned_event["Add planned event"])}>
              <PlannedEventCreateForm
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
              {eT((t) => t.planned_event["No planned events found"])}
            </OverviewHeader>
          )}
        </Overview>
      ) : (
        <PreviewList
          pagination={plannedEvents.pagination}
          sortingOrder="descending"
          buildURL={(page) => createPlannedEventsPageURL(lang, { page, order })}
        >
          {plannedEvents.items.map((plannedEvent) => (
            <PlannedEventPreview
              language={lang}
              headingLevel={2}
              key={plannedEvent.id}
              plannedEvent={plannedEvent}
            />
          ))}
        </PreviewList>
      )}
    </Page>
  );
}

export const getStaticProps = createGetStaticProps("page-planned-events");
export const getStaticPaths = getStaticExportPaths;

export default PlannedEventsPage;
