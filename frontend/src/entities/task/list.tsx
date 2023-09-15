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
import { DataExportForm, ImportDataExportForm } from "#entities/data-export";
import { NewTaskForm } from "./new";
import { TaskItem } from "./item";
import { createTask, getTasks } from "./lib";
import type { ITask, ITaskInit } from "./types";

import styles from "./list.module.scss";

interface IProps extends IArticleProps {
  translation: ILocalization["todos"];
  id: string;
}

export function TaskList({ translation, id, ...props }: IProps) {
  const [isInitialized, changeInitialization] = useState(false);
  const [tasks, changeTasks] = useState<ITask[]>([]);
  const taskListID = `${id}-task-list`;

  useEffect(() => {
    getTasks().then((storedTasks) => {
      changeTasks(storedTasks);
      changeInitialization(true);
    });
  }, []);

  async function handleTaskCreation(init: ITaskInit) {
    if (!isInitialized) {
      return;
    }

    await createTask(init);
    const newTasks = await getTasks();
    changeTasks(newTasks);
  }

  return (
    <Article {...props}>
      {() => (
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
      )}
    </Article>
  );
}
