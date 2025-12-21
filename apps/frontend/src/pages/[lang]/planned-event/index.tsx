import { useEffect, useState } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { getDictionary, type ILocalizationEntities } from "#lib/localization";
import {
  getSingleValueFromQuery,
  type ILocalizedParams,
  type ILocalizedProps,
} from "#lib/pages";
import { notFoundURL } from "#lib/urls";
import { getStaticExportPaths } from "#server";
import { useIndexedDB } from "#hooks";
import { Page } from "#components";
import { OverviewPlaceHolder } from "#components/overview";
import {
  getPlannedEvent,
  type IPlannedEvent,
  PlannetEventOverview,
} from "#entities/planned-event";

interface IProps extends ILocalizedProps<"planned-event"> {
  plannedEventTranslation: ILocalizationEntities["planned_event"];
}

interface IParams extends ILocalizedParams {}

function PlannedEventPage({
  translation,
  plannedEventTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const runTransaction = useIndexedDB();
  const [plannedEvent, changePlannedEvent] = useState<IPlannedEvent>();
  const { isReady, query } = router;
  const { lang, common, t } = translation;
  const title = t.title;
  const plannedEventID = getSingleValueFromQuery(query, "planned_event_id");
  const parsedPlannedEventID = !plannedEventID
    ? undefined
    : parseInt(plannedEventID, 10);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, parsedPlannedEventID]);

  return (
    <Page heading={t.heading} title={title}>
      {!plannedEvent ? (
        <OverviewPlaceHolder headingLevel={2} />
      ) : (
        <PlannetEventOverview
          language={lang}
          commonTranslation={common}
          translation={plannedEventTranslation}
          headingLevel={2}
          plannedEvent={plannedEvent}
        />
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
    translation: { lang, common: dict.common, t: dict.pages["planned-event"] },
    plannedEventTranslation: dict.entities.planned_event,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default PlannedEventPage;
