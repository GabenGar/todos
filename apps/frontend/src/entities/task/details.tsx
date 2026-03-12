import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Button } from "#components/button";
import { DateTime } from "#components/date";
import { EntityDescription, EntityID } from "#components/entities";
import { Heading } from "#components/heading";
import { Link, LinkButton } from "#components/link";
import { List, ListItem } from "#components/list";
import {
  type IOverviewProps,
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "#components/overview";
import type { ILocalizableProps } from "#components/types";
import { useTranslation } from "#hooks";
import { isError } from "#lib/errors";
import { logError } from "#lib/logs";
import type { INanoidID } from "#lib/strings";
import { createPlacePageURL, createTaskEditPageURL } from "#lib/urls";
import { editTask } from "./lib/edit";
import { getTask } from "./lib/get";
import { TaskStatus } from "./status";
import type { ITask } from "./types";
//

import styles from "./details.module.scss";

export interface ITaskOverviewProps extends ILocalizableProps, IOverviewProps {
  taskID: INanoidID;
  onEdit?: (editedTask: ITask) => Promise<void>;
}

/**
 * @TODO move param logic out of it
 */
export const TaskOverview = createBlockComponent(styles, Component);

function Component({ language, taskID, onEdit, ...props }: ITaskOverviewProps) {
  const { t } = useTranslation("translation");
  const router = useRouter();
  const [task, changeTask] = useState<Awaited<ReturnType<typeof getTask>>>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
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
        {() => (
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
    // deleted_at,
    place,
  } = task;

  return (
    <Overview {...props}>
      {(headinglevel) => (
        <>
          <OverviewHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <EntityID className={styles.id} entityID={id} />
          </OverviewHeader>

          <OverviewBody>
            <DescriptionList>
              <DescriptionSection
                isHorizontal
                dKey={t((t) => t.task.status)}
                dValue={<TaskStatus status={status} />}
              />

              <DescriptionSection
                dKey={t((t) => t.task.description)}
                dValue={
                  <EntityDescription>
                    {description ?? t((t) => t.task.no_description)}
                  </EntityDescription>
                }
              />

              <DescriptionSection
                dKey={t((t) => t.task.place)}
                dValue={
                  !place ? (
                    t((t) => t.task.place_unknown)
                  ) : (
                    <Link
                      href={createPlacePageURL(language, place.id)}
                      target="_blank"
                    >
                      {place.title ?? t((t) => t.task.place_unknown)} (
                      {place.id})
                    </Link>
                  )
                }
              />
            </DescriptionList>

            <hr style={{ width: "100%" }} />

            <DescriptionList>
              <DescriptionSection
                dKey={t((t) => t.task.creation_date)}
                dValue={<DateTime dateTime={created_at} />}
              />
              <DescriptionSection
                dKey={t((t) => t.task.last_updated)}
                dValue={<DateTime dateTime={updated_at} />}
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
                  {t((t) => t.task.actions.delay)}
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
                  {t((t) => t.task.actions.start)}
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
                  {t((t) => t.task.actions.fail)}
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
                  {t((t) => t.task.actions.complete)}
                </Button>
              </ListItem>
            </List>

            <hr style={{ width: "100%" }} />

            <List>
              <ListItem>
                <LinkButton href={createTaskEditPageURL(language, id)}>
                  {t((t) => t.task.edit)}
                </LinkButton>
              </ListItem>
            </List>
          </OverviewFooter>
        </>
      )}
    </Overview>
  );
}
