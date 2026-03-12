import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Page } from "#components";
import { OverviewPlaceHolder } from "#components/overview";
import {
  getPlannedEvent,
  type IPlannedEvent,
  PlannetEventOverview,
} from "#entities/planned-event";
import { useIndexedDB, usePageTranslation } from "#hooks";
import { getSingleValueFromQuery } from "#lib/pages";
import { notFoundURL } from "#lib/urls";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function PlannedEventPage({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-planned-event");
  const router = useRouter();
  const runTransaction = useIndexedDB();
  const [plannedEvent, changePlannedEvent] = useState<IPlannedEvent>();
  const { isReady, query } = router;
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);
  const plannedEventID = getSingleValueFromQuery(query, "planned_event_id");
  const parsedPlannedEventID = !plannedEventID
    ? undefined
    : parseInt(plannedEventID, 10);

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
  useEffect(() => {
    if (!isReady) {
      return;
    }

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
  }, [isReady, parsedPlannedEventID]);

  return (
    <Page heading={heading} title={title}>
      {!plannedEvent ? (
        <OverviewPlaceHolder headingLevel={2} />
      ) : (
        <PlannetEventOverview
          language={lang}
          headingLevel={2}
          plannedEvent={plannedEvent}
        />
      )}
    </Page>
  );
}

export const getStaticProps = createGetStaticProps("page-planned-event");
export const getStaticPaths = getStaticExportPaths;

export default PlannedEventPage;
