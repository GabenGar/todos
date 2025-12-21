import { useState, useEffect } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { getDictionary, type ILocalization } from "#lib/localization";
import {
  getSingleValueFromQuery,
  type ILocalizedParams,
  type ILocalizedProps,
} from "#lib/pages";
import { createTaskPageURL, createTasksPageURL } from "#lib/urls";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { Loading } from "#components";
import {
  Overview,
  OverviewBody,
  OverviewFooter,
  OverviewHeader,
} from "#components/overview";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import { Button } from "#components/button";
import { EditTaskForm, editTask, getTask, removeTask } from "#entities/task";

interface IProps extends ILocalizedProps<"task_edit"> {
  todosTranslation: ILocalization["pages"]["tasks"];
}

interface IParams extends ILocalizedParams {}

function TaskEditPage({
  translation,
  todosTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const [currentTask, changeCurrentTask] =
    useState<Awaited<ReturnType<typeof getTask>>>();
  const { isReady, query } = router;
  const { lang, common, t } = translation;
  const taskID = getSingleValueFromQuery(query, "task_id");
  const title = t.title;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, taskID]);

  return (
    <Page heading={t.heading} title={title}>
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
                      {t.task}
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
                  commonTranslation={common}
                  translation={todosTranslation}
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
                      {t["Delete"]}
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

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const props = {
    translation: {
      lang,
      common: dict.common,
      t: dict.pages["task_edit"],
    },
    todosTranslation: dict.pages.tasks,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default TaskEditPage;
