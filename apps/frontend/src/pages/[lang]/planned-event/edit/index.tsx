import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading, Page } from "#components";
import { MenuButtons, MenuItem } from "#components/button";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "#components/overview";
import {
  EditPlannedEventForm,
  editPlannedEvent,
  getPlannedEvent,
  type IPlannedEvent,
  removePlannedEvent,
} from "#entities/planned-event";
import { useIndexedDB, usePageTranslation, useTranslation } from "#hooks";
import { getSingleValueFromQuery } from "#lib/pages";
import {
  createPlannedEventPageURL,
  createPlannedEventsPageURL,
} from "#lib/urls";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function PlannedEventEditPage({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-planned-event-edit");
  const { t: eT } = useTranslation("translation");
  const { t: cT } = useTranslation("common");
  const router = useRouter();
  const runTransaction = useIndexedDB();
  const [currentPlannedEvent, changePlannedEvent] = useState<IPlannedEvent>();

  const { isReady, query } = router;
  const inputID = getSingleValueFromQuery(query, "planned_event_id");
  // consider an empty string as `undefined`
  const parsedID = !inputID?.length ? undefined : Number.parseInt(inputID, 10);
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
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
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
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
                      {eT((t) => t.planned_event["Planned event"])}
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
                    {cT((t) => t.entity["Delete"])}
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

export const getStaticProps = createGetStaticProps("page-planned-event-edit");
export const getStaticPaths = getStaticExportPaths;

export default PlannedEventEditPage;
