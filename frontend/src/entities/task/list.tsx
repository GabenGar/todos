"use client";

import { useState, useEffect } from "react";
import type { ILocalization } from "#lib/localization";
import {
  Article,
  ArticleBody,
  ArticleFooter,
  ArticleHeader,
  type IArticleProps,
} from "#components/article";
import { Loading } from "components/loading";
import { type IHeadingLevel } from "#components/heading";
import { DataExportForm, ImportDataExportForm } from "#entities/data-export";
import { NewTaskForm } from "./new";
import { TaskItem } from "./item";
import { getTasks } from "./lib/get";
import { createTask } from "./lib/create";
import type { ITask, ITaskInit } from "./types";

import styles from "./list.module.scss";

interface IProps extends IArticleProps {
  translation: ILocalization["todos"];
  id: string;
  headingLevel: IHeadingLevel;
}

/**
 * @TODO get tasks filter
 */
export function TaskList({ translation, id, headingLevel, ...props }: IProps) {
  const [isInitialized, changeInitialization] = useState(false);
  const [tasks, changeTasks] = useState<ITask[]>([]);
  const taskListID = `${id}-task-list`;

  useEffect(() => {
    getTasks(false).then((storedTasks) => {
      changeTasks(storedTasks);
      changeInitialization(true);
    });
  }, []);

  async function handleTaskCreation(init: ITaskInit) {
    if (!isInitialized) {
      return;
    }

    await createTask(init);
    const newTasks = await getTasks(false);
    changeTasks(newTasks);
  }

  return (
    <Article headingLevel={headingLevel} {...props}>
      {(headingLevel) => {
        return (
          <>
            <ArticleHeader>
              <NewTaskForm
                translation={translation.new_todo}
                id={taskListID}
                onNewTask={handleTaskCreation}
              />
            </ArticleHeader>

            <ArticleBody>
              <ul className={styles.list}>
                {!isInitialized ? (
                  <Loading />
                ) : (
                  tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      headingLevel={headingLevel}
                      translation={translation}
                      task={task}
                    />
                  ))
                )}
              </ul>
            </ArticleBody>

            <ArticleFooter>
              <ul className={styles.buttons}>
                <DataExportForm translation={translation} />
                <ImportDataExportForm
                  translation={translation}
                  id="import-data-export"
                  onSuccess={async () => {
                    const newTasks = await getTasks();
                    changeTasks(newTasks);
                  }}
                />
              </ul>
            </ArticleFooter>
          </>
        );
      }}
    </Article>
  );
}
