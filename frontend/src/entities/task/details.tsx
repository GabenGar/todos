"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { INanoidID } from "#lib/strings";
import type { ILocalization } from "#lib/localization";
import { createTasksPageURL } from "#lib/urls";
import { createBlockComponent } from "#components/meta";
import {
  Article,
  ArticleBody,
  ArticleFooter,
  ArticleHeader,
  type IArticleProps,
} from "#components/article";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import { DateTime } from "#components/date";
import { Button } from "#components/button";
import { getTask } from "./lib/get";
import { editTask } from "./lib/edit";
import { removeTask } from "./lib/remove";
import { TaskStatus } from "./status";
import type { ITask } from "./types";

import styles from "./details.module.scss";

interface IProps extends IArticleProps {
  translation: ILocalization["task"];
  taskID: INanoidID;
  onEdit?: (editedTask: ITask) => Promise<void>;
}

export const TaskDetails = createBlockComponent(styles, Component);

function Component({ translation, taskID, onEdit, ...props }: IProps) {
  const router = useRouter();
  const [task, changeTask] = useState<Awaited<ReturnType<typeof getTask>>>();

  useEffect(() => {
    getTask(taskID).then((task) => changeTask(task));
  }, [taskID]);

  if (!task) {
    return (
      <Article {...props}>
        {(headinglevel) => (
          <>
            <ArticleHeader>
              <Loading />
            </ArticleHeader>
            <ArticleBody>
              <Loading />
            </ArticleBody>
            <ArticleFooter>
              <Loading />
            </ArticleFooter>
          </>
        )}
      </Article>
    );
  }

  const { id, title, description, created_at, updated_at, status, deleted_at } =
    task;

  return (
    <Article {...props}>
      {(headinglevel) => (
        <>
          <ArticleHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <div>{id}</div>
          </ArticleHeader>

          <ArticleBody>
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
                dValue={description ?? translation.no_description}
              />
            </DescriptionList>
            <hr style={{ width: "100%" }} />
            <DescriptionList>
              <DescriptionSection
                dKey={translation.creation_date}
                dValue={<DateTime dateTime={created_at} />}
              />
              <DescriptionSection
                dKey={translation.last_updated}
                dValue={<DateTime dateTime={updated_at} />}
              />
            </DescriptionList>
          </ArticleBody>

          <ArticleFooter className={styles.footer}>
            {/* @TODO two-layer group */}
            <ul className={styles.actions}>
              <li>
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
              </li>
              <li>
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
              </li>
            </ul>

            <ul className={styles.actions}>
              <li>
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
              </li>
              <li>
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
              </li>
            </ul>

            <hr style={{ width: "100%" }} />

            <ul>
              <li>
                <Link href="/tasks">{translation.back_to_tasks}</Link>
              </li>
            </ul>

            <hr style={{ width: "100%" }} />

            <ul className={styles.actions}>
              <li className={styles.delete}>
                <Button
                  className={styles.action}
                  viewType="negative"
                  disabled={Boolean(deleted_at)}
                  onClick={async () => {
                    await removeTask(id);
                    router.push(createTasksPageURL);
                  }}
                >
                  {translation.delete}
                </Button>
              </li>
            </ul>
          </ArticleFooter>
        </>
      )}
    </Article>
  );
}
