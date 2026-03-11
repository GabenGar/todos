import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loading, Page } from "#components";
import { Button } from "#components/button";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "#components/overview";
import { EditTaskForm, editTask, getTask, removeTask } from "#entities/task";
import { usePageTranslation } from "#hooks";
import { getSingleValueFromQuery } from "#lib/pages";
import { createTaskPageURL, createTasksPageURL } from "#lib/urls";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function TaskEditPage({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-task-edit");
  const router = useRouter();
  const [currentTask, changeCurrentTask] =
    useState<Awaited<ReturnType<typeof getTask>>>();
  const { isReady, query } = router;
  const taskID = getSingleValueFromQuery(query, "task_id");
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!taskID) {
      router.replace("/404");
      return;
    }

    (async () => {
      const task = await getTask(taskID);
      changeCurrentTask(task);
    })();
  }, [isReady, taskID]);

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <List>
                <ListItem>
                  {!currentTask ? (
                    <Loading />
                  ) : (
                    <Link href={createTaskPageURL(lang, currentTask.id)}>
                      {t((t) => t.task)}
                    </Link>
                  )}
                </ListItem>
              </List>
            </OverviewHeader>

            <OverviewBody>
              {!currentTask ? (
                <Loading />
              ) : (
                <EditTaskForm
                  language={lang}
                  id="edit-task"
                  currentTask={currentTask}
                  onTaskEdit={async (taskUpdate) => {
                    const editedTask = await editTask(taskUpdate);

                    changeCurrentTask(editedTask);
                  }}
                />
              )}
            </OverviewBody>

            <OverviewFooter>
              <List>
                <ListItem>
                  {!currentTask ? (
                    <Loading />
                  ) : (
                    <Button
                      viewType="negative"
                      disabled={Boolean(currentTask.deleted_at)}
                      onClick={async () => {
                        await removeTask(currentTask.id);
                        const url = createTasksPageURL(lang);
                        router.push(url);
                      }}
                    >
                      {t((t) => t["Delete"])}
                    </Button>
                  )}
                </ListItem>
              </List>
            </OverviewFooter>
          </>
        )}
      </Overview>
    </Page>
  );
}

export const getStaticProps = createGetStaticProps("page-task-edit");

export const getStaticPaths = getStaticExportPaths;

export default TaskEditPage;
