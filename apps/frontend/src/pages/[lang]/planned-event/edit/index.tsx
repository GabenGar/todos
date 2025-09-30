import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { getDictionary, type ILocalizationEntities } from "#lib/localization";
import {
  getSingleValueFromQuery,
  type ILocalizedParams,
  type ILocalizedProps,
} from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { useState, useEffect } from "react";
import {
  createPlannedEventPageURL,
  createPlannedEventsPageURL,
} from "#lib/urls";
import { useIndexedDB } from "#hooks";
import { Loading } from "#components";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "#components/overview";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import { MenuButtons, MenuItem } from "#components/button";
import {
  EditPlannedEventForm,
  getPlannedEvent,
  editPlannedEvent,
  removePlannedEvent,
  type IPlannedEvent,
} from "#entities/planned-event";
import { useRouter } from "next/router";

interface IProps extends ILocalizedProps<"planned-event_edit"> {
  plannedEventTranslation: ILocalizationEntities["planned_event"];
}

interface IParams extends ILocalizedParams {}

function PlannedEventEditPage({
  translation,
  plannedEventTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const runTransaction = useIndexedDB();
  const [currentPlannedEvent, changePlannedEvent] = useState<IPlannedEvent>();
  const { lang, common, t } = translation;
  const { isReady, query } = router;
  const inputID = getSingleValueFromQuery(query, "planned_event_id");
  // consider an empty string as `undefined`
  const parsedID = !inputID?.length ? undefined : Number.parseInt(inputID, 10);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!parsedID) {
      router.replace("/404");
      return;
    }

    runTransaction(
      "planned_events",
      "readonly",
      (error) => {
        throw error;
      },
      (transaction) => {
        getPlannedEvent({ transaction, id: parsedID }, (plannedEvent) =>
          changePlannedEvent(plannedEvent),
        );
      },
    );
  }, [isReady, parsedID]);

  return (
    <Page heading={t.heading} title={t.title}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <List>
                <ListItem>
                  {!currentPlannedEvent ? (
                    <Loading />
                  ) : (
                    <Link
                      href={createPlannedEventPageURL(
                        lang,
                        currentPlannedEvent.id,
                      )}
                    >
                      {plannedEventTranslation["Planned event"]}
                    </Link>
                  )}
                </ListItem>
              </List>
            </OverviewHeader>

            <OverviewBody>
              {!currentPlannedEvent ? (
                <Loading />
              ) : (
                <EditPlannedEventForm
                  commonTranslation={common}
                  translation={plannedEventTranslation}
                  id={`edit-planned-event-${currentPlannedEvent.id}`}
                  currentPlannedEvent={currentPlannedEvent}
                  onPlannedEventEdit={async (update) => {
                    runTransaction(
                      "planned_events",
                      "readwrite",
                      (error) => {
                        throw error;
                      },
                      (transaction) => {
                        editPlannedEvent(transaction, update, (updatedEvent) =>
                          changePlannedEvent(updatedEvent),
                        );
                      },
                    );
                  }}
                />
              )}
            </OverviewBody>

            <OverviewFooter>
              {!currentPlannedEvent ? (
                <Loading />
              ) : (
                <MenuButtons>
                  <MenuItem
                    viewType="negative"
                    onClick={async () => {
                      runTransaction(
                        "planned_events",
                        "readwrite",
                        (event) => {
                          throw new Error(String(event));
                        },
                        (transaction) => {
                          removePlannedEvent(
                            transaction,
                            currentPlannedEvent.id,
                            () => {
                              router.replace(createPlannedEventsPageURL(lang));
                            },
                          );
                        },
                      );
                    }}
                  >
                    {common.entity["Delete"]}
                  </MenuItem>
                </MenuButtons>
              )}
            </OverviewFooter>
          </>
        )}
      </Overview>
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
      t: dict.pages["planned-event_edit"],
    },
    plannedEventTranslation: dict.entities.planned_event,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default PlannedEventEditPage;
