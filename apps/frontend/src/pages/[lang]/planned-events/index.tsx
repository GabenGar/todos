import { useState, useEffect } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { getDictionary, type ILocalizationEntities } from "#lib/localization";
import {
  getSingleValueFromQuery,
  type ILocalizedParams,
  type ILocalizedProps,
} from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { createPlannedEventsPageURL } from "#lib/urls";
import type { IPaginatedCollection } from "#lib/pagination";
import { useIndexedDB } from "#hooks";
import { Details, Loading } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { PreviewList } from "#components/preview";
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

interface IProps extends ILocalizedProps<"planned-events"> {
  plannedEventTranslation: ILocalizationEntities["planned_event"];
}

interface IParams extends ILocalizedParams {}

function PlannedEventsPage({
  translation,
  plannedEventTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const runTransaction = useIndexedDB();
  const [plannedEvents, changePlannedEvents] =
    useState<IPaginatedCollection<IPlannedEvent>>();
  const [isLoading, switchLoading] = useState(true);
  const { isReady, query } = router;
  const { lang, common, t } = translation;
  const inputPage = getSingleValueFromQuery(query, "page");
  const page = !inputPage ? undefined : parseInt(inputPage, 10);
  const inputOrder = getSingleValueFromQuery(query, "order");
  const order = !isPlannedEventsOrder(inputOrder) ? undefined : inputOrder;
  const title =
    !isReady || !order || order === "recently_created"
      ? t["Recently created planned events"]
      : t["Recently updated planned events"];
  // it has to be this way to avoid hydration errors
  const heading =
    !isReady || !order || order === "recently_created"
      ? t["Recently Created Planned Events"]
      : t["Recently Updated Planned Events"];

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
                new Error(plannedEventTranslation["No planned events found"]),
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
        {(headingLevel) => (
          <OverviewHeader>
            <Details summary={plannedEventTranslation["Filter"]}>
              <SearchPlannedEventForm
                key={order}
                commonTranslation={common}
                translation={plannedEventTranslation}
                id="search-planned-event"
                onSearch={handlePlannedEventsSearch}
                defaultOrder={order}
              />
            </Details>

            <Details summary={plannedEventTranslation["Add planned event"]}>
              <PlannedEventCreateForm
                commonTranslation={common}
                translation={plannedEventTranslation}
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
              {plannedEventTranslation["No planned events found"]}
            </OverviewHeader>
          )}
        </Overview>
      ) : (
        <PreviewList
          pagination={plannedEvents.pagination}
          commonTranslation={common}
          sortingOrder="descending"
          buildURL={(page) => createPlannedEventsPageURL(lang, { page, order })}
        >
          {plannedEvents.items.map((plannedEvent) => (
            <PlannedEventPreview
              language={lang}
              commonTranslation={common}
              translation={plannedEventTranslation}
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

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const props = {
    translation: {
      lang,
      common: dict.common,
      t: dict.pages["planned-events"],
    },
    plannedEventTranslation: dict.entities.planned_event,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default PlannedEventsPage;
