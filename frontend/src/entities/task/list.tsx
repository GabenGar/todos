"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ILocalization, ILocalizationCommon } from "#lib/localization";
import { createTasksPageURL } from "#lib/urls";
import {
  Article,
  ArticleBody,
  ArticleFooter,
  ArticleHeader,
  type IArticleProps,
} from "#components/article";
import { Loading } from "components/loading";
import { type IHeadingLevel } from "#components/heading";
import { Pagination, PaginationOverview } from "#components/pagination";
import { DataExportForm, ImportDataExportForm } from "#entities/data-export";
import { type INewTaskFormProps, NewTaskForm } from "./new";
import { TaskItem } from "./item";
import { getTasks } from "./lib/get";
import { createTask } from "./lib/create";
import type { ITaskInit } from "./types";

import styles from "./list.module.scss";

interface IProps extends IArticleProps {
  commonTranslation: ILocalizationCommon;
  translation: ILocalization["todos"];
  id: string;
  headingLevel: IHeadingLevel;
}

/**
 * @TODO get tasks filter
 */
export function TaskList({
  commonTranslation,
  translation,
  id,
  headingLevel,
  ...props
}: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, changeTasks] = useState<Awaited<ReturnType<typeof getTasks>>>();
  const inputPage = searchParams.get("page");
  const page = inputPage === null ? undefined : parseInt(inputPage, 10);
  const inputQuery = searchParams.get("query");
  const query =
    inputQuery === null || inputQuery.trim().length === 0
      ? undefined
      : inputQuery.trim();
  const options: Parameters<typeof getTasks>[0] = {
    includeDeleted: false,
    page,
    query,
  };

  useEffect(() => {
    (async () => {
      const newTasks = await getTasks(options);

      if (page !== newTasks.pagination.currentPage) {
        const newTasksURL = createTasksPageURL({
          page: newTasks.pagination.currentPage,
          query,
        });

        router.replace(newTasksURL);

        return;
      }

      changeTasks(newTasks);
    })();
  }, [page, query]);

  async function handleTaskCreation(init: ITaskInit) {
    await createTask(init);
    const newTasks = await getTasks(options);
    changeTasks(newTasks);
  }

  return (
    <Article headingLevel={headingLevel} {...props}>
      {(headingLevel) => {
        return (
          <>
            <Header
              commonTranslation={commonTranslation}
              translation={translation}
              id={id}
              onNewTask={handleTaskCreation}
            />

            <ArticleBody>
              {!tasks ? (
                <Loading />
              ) : (
                <PaginationOverview
                  commonTranslation={commonTranslation}
                  pagination={tasks.pagination}
                />
              )}

              <ul className={styles.list}>
                {!tasks ? (
                  <Loading />
                ) : (
                  tasks.items.map((task) => (
                    <TaskItem
                      key={task.id}
                      headingLevel={headingLevel}
                      translation={translation}
                      task={task}
                    />
                  ))
                )}
              </ul>

              {!tasks ? (
                <Loading />
              ) : (
                <Pagination
                  commonTranslation={commonTranslation}
                  pagination={tasks.pagination}
                  buildURL={(page) => {
                    const url = createTasksPageURL({
                      page,
                      query,
                    });

                    return url;
                  }}
                />
              )}
            </ArticleBody>

            <ArticleFooter>
              <ul className={styles.buttons}>
                <li>
                  <DataExportForm translation={translation} />
                </li>

                <li>
                  <ImportDataExportForm
                    commonTranslation={commonTranslation}
                    translation={translation}
                    id="import-data-export"
                    onSuccess={async () => {
                      const newTasks = await getTasks(options);
                      changeTasks(newTasks);
                    }}
                  />
                </li>
              </ul>
            </ArticleFooter>
          </>
        );
      }}
    </Article>
  );
}

interface IHeaderProps
  extends Pick<IProps, "commonTranslation" | "translation" | "id">,
    Pick<INewTaskFormProps, "onNewTask"> {}

function Header({
  commonTranslation,
  translation,
  id,
  onNewTask,
}: IHeaderProps) {
  const [] = useState()
  const taskListID = `${id}-task-list`;
  return (
    <ArticleHeader>
      <NewTaskForm
        commonTranslation={commonTranslation}
        translation={translation.new_todo}
        id={taskListID}
        onNewTask={onNewTask}
      />
    </ArticleHeader>
  );
}
