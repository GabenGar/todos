"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { INanoidID } from "#lib/strings";
import type { ILocalization } from "#lib/localization";
import { createPlacePageURL, createTaskEditPageURL } from "#lib/urls";
import { logError } from "#lib/logs";
import { isError } from "#lib/errors";
import { createBlockComponent } from "#components/meta";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Heading } from "#components/heading";
import { Link, LinkButton } from "#components/link";
import { DateTime } from "#components/date";
import { Button } from "#components/button";
import {
  Details,
  DetailsBody,
  DetailsFooter,
  DetailsHeader,
  type IDetailsProps,
} from "#components/details";
import { EntityDescription, EntityID } from "#components/entities";
import { List, ListItem } from "#components/list";
import type { ITranslatableProps } from "#components/types";
import { getTask } from "./lib/get";
import { editTask } from "./lib/edit";
import { TaskStatus } from "./status";
import type { ITask } from "./types";

import styles from "./details.module.scss";

export interface ITaskDetailsProps extends ITranslatableProps, IDetailsProps {
  translation: ILocalization["task"];
  taskID: INanoidID;
  onEdit?: (editedTask: ITask) => Promise<void>;
}

/**
 * @TODO move param logic out of it
 */
export const TaskDetails = createBlockComponent(styles, Component);

function Component({
  commonTranslation,
  translation,
  taskID,
  onEdit,
  ...props
}: ITaskDetailsProps) {
  const router = useRouter();
  const [task, changeTask] = useState<Awaited<ReturnType<typeof getTask>>>();

  useEffect(() => {
    (async () => {
      try {
        const newTask = await getTask(taskID);
        changeTask(newTask);
      } catch (error) {
        if (!isError(error)) {
          throw error;
        }

        logError(error);
        router.replace("/404");
      }
    })();
  }, [taskID]);

  if (!task) {
    return (
      <Details {...props}>
        {(headinglevel) => (
          <>
            <DetailsHeader>
              <Loading />
            </DetailsHeader>
            <DetailsBody>
              <Loading />
            </DetailsBody>
            <DetailsFooter>
              <Loading />
            </DetailsFooter>
          </>
        )}
      </Details>
    );
  }

  const {
    id,
    title,
    description,
    created_at,
    updated_at,
    status,
    deleted_at,
    place,
  } = task;

  return (
    <Details {...props}>
      {(headinglevel) => (
        <>
          <DetailsHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <EntityID
              className={styles.id}
              commonTranslation={commonTranslation}
              entityID={id}
            />
          </DetailsHeader>

          <DetailsBody>
            <DescriptionList>
              <DescriptionSection
                isHorizontal
                dKey={translation.status}
                dValue={
                  <TaskStatus
                    translation={translation.status_values}
                    status={status}
                  />
                }
              />

              <DescriptionSection
                dKey={translation.description}
                dValue={
                  <EntityDescription>
                    {description ?? translation.no_description}
                  </EntityDescription>
                }
              />

              <DescriptionSection
                dKey={translation.place}
                dValue={
                  !place ? (
                    translation.place_unknown
                  ) : (
                    <Link href={createPlacePageURL(place.id)} target="_blank">
                      {place.title ?? translation.place_unknown} ({place.id})
                    </Link>
                  )
                }
              />
            </DescriptionList>

            <hr style={{ width: "100%" }} />

            <DescriptionList>
              <DescriptionSection
                dKey={translation.creation_date}
                dValue={
                  <DateTime
                    commonTranslation={commonTranslation}
                    dateTime={created_at}
                  />
                }
              />
              <DescriptionSection
                dKey={translation.last_updated}
                dValue={
                  <DateTime
                    commonTranslation={commonTranslation}
                    dateTime={updated_at}
                  />
                }
              />
            </DescriptionList>
          </DetailsBody>

          <DetailsFooter className={styles.footer}>
            {/* @TODO two-layer group */}
            <List className={styles.actions}>
              <ListItem>
                <Button
                  className={styles.action}
                  viewType="reset"
                  disabled={status === "pending"}
                  onClick={async () => {
                    const editedTask = await editTask({
                      id,
                      status: "pending",
                    });
                    changeTask(editedTask);
                    onEdit?.(editedTask);
                  }}
                >
                  {translation.actions.delay}
                </Button>
              </ListItem>

              <ListItem>
                <Button
                  className={styles.action}
                  viewType="submit"
                  disabled={status === "in-progress"}
                  onClick={async () => {
                    const editedTask = await editTask({
                      id,
                      status: "in-progress",
                    });
                    changeTask(editedTask);
                    onEdit?.(editedTask);
                  }}
                >
                  {translation.actions.start}
                </Button>
              </ListItem>
            </List>

            <List className={styles.actions}>
              <ListItem>
                <Button
                  className={styles.action}
                  viewType="negative"
                  disabled={status === "failed"}
                  onClick={async () => {
                    const editedTask = await editTask({ id, status: "failed" });
                    changeTask(editedTask);
                    onEdit?.(editedTask);
                  }}
                >
                  {translation.actions.fail}
                </Button>
              </ListItem>

              <ListItem>
                <Button
                  className={styles.action}
                  viewType="positive"
                  disabled={status === "finished"}
                  onClick={async () => {
                    const editedTask = await editTask({
                      id,
                      status: "finished",
                    });
                    changeTask(editedTask);
                    onEdit?.(editedTask);
                  }}
                >
                  {translation.actions.complete}
                </Button>
              </ListItem>
            </List>

            <hr style={{ width: "100%" }} />

            <List>
              <ListItem>
                <LinkButton href={createTaskEditPageURL(id)}>
                  {translation.edit}
                </LinkButton>
              </ListItem>
            </List>
          </DetailsFooter>
        </>
      )}
    </Details>
  );
}
