"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ILocalization } from "#lib/localization";
import { createTasksPageURL } from "#lib/urls";
import { Loading } from "components/loading";
import { Button } from "#components/button";
import { PreviewList } from "#components/preview";
import {
  Details,
  DetailsBody,
  DetailsHeader,
  IDetailsProps,
} from "#components/details";
import { ITranslatableProps } from "#components/types";
import {
  DataExportForm,
  IImportDataExportFormProps,
  ImportDataExportForm,
} from "#entities/data-export";
import { type INewTaskFormProps, NewTaskForm } from "./new";
import { type ISearchTasksFormProps, SearchTasksForm } from "./search";
import { getTasks } from "./lib/get";
import { createTask } from "./lib/create";
import { TaskPreview } from "./preview";
import type { ITaskInit } from "./types";

import styles from "./list.module.scss";

interface IProps extends ITranslatableProps, Pick<IDetailsProps, "headingLevel"> {
  translation: ILocalization["todos"];
  taskTranslation: ILocalization["task"];
  id: string;
}

/**
 * @TODO get tasks filter
 */
export function TaskList({
  commonTranslation,
  translation,
  taskTranslation,
  id,
  headingLevel,
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

      if (newTasks.pagination.totalCount === 0) {
        changeTasks(newTasks);
        return;
      }

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

  async function handleTaskSearch(newQuery: string) {
    const { pagination } = await getTasks({
      includeDeleted: false,
      query: newQuery,
    });

    const newURL = createTasksPageURL({
      page: pagination.currentPage,
      query: newQuery,
    });

    router.push(newURL);
  }

  return (
    <>
      <Forms
        commonTranslation={commonTranslation}
        translation={translation}
        headingLevel={headingLevel}
        id={id}
        query={query}
        onNewTask={handleTaskCreation}
        onSearch={handleTaskSearch}
      />

      {!tasks ? (
        <Details headingLevel={headingLevel}>
          {() => (
            <DetailsBody>
              <Loading />
            </DetailsBody>
          )}
        </Details>
      ) : (
        <PreviewList
          commonTranslation={commonTranslation}
          pagination={tasks.pagination}
          buildURL={(page) => {
            const url = createTasksPageURL({
              page,
              query,
            });

            return url;
          }}
        >
          {tasks.items.map((task) => (
            <TaskPreview
              key={task.id}
              headingLevel={headingLevel}
              translation={taskTranslation}
              task={task}
            />
          ))}
        </PreviewList>
      )}

      <ImportForms
        commonTranslation={commonTranslation}
        translation={translation}
        headingLevel={headingLevel}
        id={id}
        onSuccess={async () => {
          const updatedTasks = await getTasks(options);
          changeTasks(updatedTasks);
        }}
      />
    </>
  );
}

interface IFormsProps
  extends Pick<
      IProps,
      "commonTranslation" | "translation" | "id" | "headingLevel"
    >,
    Pick<INewTaskFormProps, "onNewTask">,
    Pick<ISearchTasksFormProps, "onSearch"> {
  query?: string;
}

function Forms({
  commonTranslation,
  translation,
  headingLevel,
  id,
  query,
  onNewTask,
  onSearch,
}: IFormsProps) {
  const [isNewFormShown, switchNewForm] = useState(false);
  const [isSearchFormShown, switchSearchForm] = useState(Boolean(query));
  const { add, search } = translation;
  const newFormID = `${id}-task-list-new`;
  const searchFormID = `${id}-task-list-search`;

  return (
    <Details headingLevel={headingLevel}>
      {() => (
        <DetailsHeader>
          <div className={styles.header}>
            <Button onClick={() => switchSearchForm((old) => !old)}>
              {search}
            </Button>
            {isSearchFormShown && (
              <SearchTasksForm
                commonTranslation={commonTranslation}
                translation={translation.search_tasks}
                id={searchFormID}
                defaultQuery={query}
                onSearch={onSearch}
              />
            )}
          </div>

          <div className={styles.header}>
            <Button onClick={() => switchNewForm((old) => !old)}>{add}</Button>
            {isNewFormShown && (
              <NewTaskForm
                commonTranslation={commonTranslation}
                translation={translation.new_todo}
                id={newFormID}
                onNewTask={onNewTask}
              />
            )}
          </div>
        </DetailsHeader>
      )}
    </Details>
  );
}

interface IImportFormsProps
  extends Pick<
      IProps,
      "commonTranslation" | "translation" | "id" | "headingLevel"
    >,
    Pick<IImportDataExportFormProps, "onSuccess"> {}

function ImportForms({
  commonTranslation,
  translation,
  headingLevel,
  id,
  onSuccess,
}: IImportFormsProps) {
  const importFormID = `${id}-import-data-export`;

  return (
    <Details headingLevel={headingLevel}>
      {() => (
        <DetailsHeader>
          <ul className={styles.buttons}>
            <li>
              <DataExportForm translation={translation} />
            </li>

            <li>
              <ImportDataExportForm
                commonTranslation={commonTranslation}
                translation={translation}
                id={importFormID}
                onSuccess={onSuccess}
              />
            </li>
          </ul>
        </DetailsHeader>
      )}
    </Details>
  );
}
