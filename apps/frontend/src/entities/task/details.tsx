

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { INanoidID } from "#lib/strings";
import type { ILocalization } from "#lib/localization";
import { createPlacePageURL, createTaskEditPageURL } from "#lib/urls";
import { logError } from "#lib/logs";
import { isError } from "#lib/errors";
import { createBlockComponent } from "@repo/ui/meta";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Heading } from "#components/heading";
import { Link, LinkButton } from "#components/link";
import { DateTime } from "#components/date";
import { Button } from "#components/button";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
  type IOverviewProps,
} from "#components/overview";
import { EntityDescription, EntityID } from "#components/entities";
import { List, ListItem } from "#components/list";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import { getTask } from "./lib/get";
import { editTask } from "./lib/edit";
import { TaskStatus } from "./status";
import type { ITask } from "./types";

import styles from "./details.module.scss";

export interface ITaskOverviewProps
  extends ILocalizableProps,
    ITranslatableProps,
    IOverviewProps {
  translation: ILocalization["pages"]["task"];
  taskID: INanoidID;
  onEdit?: (editedTask: ITask) => Promise<void>;
}

/**
 * @TODO move param logic out of it
 */
export const TaskOverview = createBlockComponent(styles, Component);

function Component({
  language,
  commonTranslation,
  translation,
  taskID,
  onEdit,
  ...props
}: ITaskOverviewProps) {
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
      <Overview {...props}>
        {(headinglevel) => (
          <>
            <OverviewHeader>
              <Loading />
            </OverviewHeader>
            <OverviewBody>
              <Loading />
            </OverviewBody>
            <OverviewFooter>
              <Loading />
            </OverviewFooter>
          </>
        )}
      </Overview>
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
    <Overview {...props}>
      {(headinglevel) => (
        <>
          <OverviewHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <EntityID
              className={styles.id}
              commonTranslation={commonTranslation}
              entityID={id}
            />
          </OverviewHeader>

          <OverviewBody>
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
                    <Link
                      href={createPlacePageURL(language, place.id)}
                      target="_blank"
                    >
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
          </OverviewBody>

          <OverviewFooter className={styles.footer}>
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
                <LinkButton href={createTaskEditPageURL(language, id)}>
                  {translation.edit}
                </LinkButton>
              </ListItem>
            </List>
          </OverviewFooter>
        </>
      )}
    </Overview>
  );
}
