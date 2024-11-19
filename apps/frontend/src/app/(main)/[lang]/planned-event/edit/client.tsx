"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createPlannedEventPageURL,
  createPlannedEventsPageURL,
} from "#lib/urls";
import type { ILocalizationEntities } from "#lib/localization";
import { Loading } from "#components";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
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
  deletePlannedEvent,
  getPlannedEvent,
} from "#entities/planned-event";
import { editPlannedEvent } from "#entities/planned-event";

interface IProps extends ITranslatableProps, ILocalizableProps {
  translation: ILocalizationEntities["planned_event"];
}

export function Client({ language, commonTranslation, translation }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPlannedEvent, changePlannedEvent] =
    useState<Awaited<ReturnType<typeof getPlannedEvent>>>();
  const inputID = searchParams.get("planned_event_id")?.trim();
  // consider an empty string as `undefined`
  const parsedID = !inputID?.length ? undefined : Number.parseInt(inputID, 10);

  useEffect(() => {
    if (!parsedID) {
      router.replace("/404");
      return;
    }

    (async () => {
      const plannedEvent = await getPlannedEvent(parsedID);
      changePlannedEvent(plannedEvent);
    })();
  }, [parsedID]);

  return (
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
                      language,
                      currentPlannedEvent.id,
                    )}
                  >
                    {translation["Planned event"]}
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
                commonTranslation={commonTranslation}
                translation={translation}
                id={`edit-planned-event-${currentPlannedEvent.id}`}
                currentPlannedEvent={currentPlannedEvent}
                onPlannedEventEdit={async (update) => {
                  const editedPlannedEvent = await editPlannedEvent(update);

                  changePlannedEvent(editedPlannedEvent);
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
                    await deletePlannedEvent(currentPlannedEvent.id);

                    router.replace(createPlannedEventsPageURL(language));
                  }}
                >
                  {commonTranslation.entity["Delete"]}
                </MenuItem>
              </MenuButtons>
            )}
          </OverviewFooter>
        </>
      )}
    </Overview>
  );
}
