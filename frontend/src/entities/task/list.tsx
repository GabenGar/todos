"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ILocalization, ILocalizationCommon } from "#lib/localization";
import {
  Article,
  ArticleBody,
  ArticleFooter,
  ArticleHeader,
  type IArticleProps,
} from "#components/article";
import { Loading } from "components/loading";
import { type IHeadingLevel } from "#components/heading";
import { Pagination } from "#components/pagination";
import { DataExportForm, ImportDataExportForm } from "#entities/data-export";
import { NewTaskForm } from "./new";
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
  const taskListID = `${id}-task-list`;
  const page = searchParams.get("page");
  const parsedPage = page === null ? undefined : Number(page);

  useEffect(() => {
    getTasks({ includeDeleted: false, page: parsedPage }).then((newTasks) => {
      if (parsedPage !== newTasks.pagination.currentPage) {
        const searchParams = new URLSearchParams([
          ["page", String(newTasks.pagination.currentPage)],
        ]);
        router.replace(`/tasks?${searchParams.toString()}`);
      }

      changeTasks(newTasks);
    });
  }, [parsedPage]);

  async function handleTaskCreation(init: ITaskInit) {
    await createTask(init);
    const newTasks = await getTasks();
    changeTasks(newTasks);
  }

  return (
    <Article headingLevel={headingLevel} {...props}>
      {(headingLevel) => {
        return (
          <>
            <ArticleHeader>
              <NewTaskForm
                commonTranslation={commonTranslation}
                translation={translation.new_todo}
                id={taskListID}
                onNewTask={handleTaskCreation}
              />
            </ArticleHeader>

            <ArticleBody>
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
                    const searchParams = new URLSearchParams([
                      ["page", String(page)],
                    ]);
                    return `/tasks?${searchParams.toString()}`;
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
                      const newTasks = await getTasks();
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
