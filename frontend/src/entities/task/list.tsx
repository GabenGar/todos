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
  type IDetailsProps,
} from "#components/details";
import { ITranslatableProps } from "#components/types";
import {
  DataExportForm,
  type IImportDataExportFormProps,
  ImportDataExportForm,
} from "#entities/data-export";
import { type INewTaskFormProps, NewTaskForm } from "./new";
import {
  type ISearchTasksFormProps,
  SearchTasksForm,
  type ITaskSearchQuery,
} from "./search";
import { getTasks } from "./lib/get";
import { createTask } from "./lib/create";
import { TaskPreview } from "./preview";
import { isTaskStatus, type ITask, type ITaskInit } from "./types";

import styles from "./list.module.scss";

interface IProps
  extends ITranslatableProps,
    Pick<IDetailsProps, "headingLevel"> {
  translation: ILocalization["todos"];
  taskTranslation: ILocalization["task"];
  statusTranslation: ILocalization["stats_tasks"]["status_values"];
  id: string;
}

export function TaskList({
  commonTranslation,
  translation,
  taskTranslation,
  statusTranslation,
  id,
  headingLevel,
}: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, changeTasks] = useState<Awaited<ReturnType<typeof getTasks>>>();
  const inputPage = searchParams.get("page")?.trim();
  const page = !inputPage ? undefined : parseInt(inputPage, 10);
  const inputQuery = searchParams.get("query")?.trim();
  const query = !inputQuery ? undefined : inputQuery;
  const inputStatus = searchParams.get("status")?.trim();
  const status = !isTaskStatus(inputStatus) ? undefined : inputStatus;
  const options: Parameters<typeof getTasks>[0] = {
    includeDeleted: false,
    page,
    query,
    status,
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
          status,
        });

        router.replace(newTasksURL);

        return;
      }

      changeTasks(newTasks);
    })();
  }, [page, query, status]);

  async function handleTaskCreation(init: ITaskInit) {
    await createTask(init);
    const newTasks = await getTasks(options);

    if (newTasks.pagination.totalPages !== tasks?.pagination.totalPages) {
      const newOptions = {
        page: newTasks.pagination.totalPages,
        query: options?.query,
        status: options?.status,
      };
      const newURL = createTasksPageURL(newOptions);
      router.replace(newURL);

      return;
    }

    changeTasks(newTasks);
  }

  async function handleTaskSearch(newQuery: ITaskSearchQuery) {
    const { pagination } = await getTasks({
      includeDeleted: false,
      query: newQuery.query,
      status: newQuery?.status,
    });

    const newURL = createTasksPageURL({
      page: pagination.currentPage,
      query: newQuery.query,
      status: newQuery?.status,
    });

    router.replace(newURL);
  }

  return (
    <>
      <Forms
        commonTranslation={commonTranslation}
        translation={translation}
        statusTranslation={statusTranslation}
        headingLevel={headingLevel}
        id={id}
        query={query}
        status={status}
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
              status,
            });

            return url;
          }}
          sortingOrder="descending"
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
      | "commonTranslation"
      | "translation"
      | "statusTranslation"
      | "id"
      | "headingLevel"
    >,
    Pick<INewTaskFormProps, "onNewTask">,
    Pick<ISearchTasksFormProps, "onSearch"> {
  query?: string;
  status?: ITask["status"];
}

function Forms({
  commonTranslation,
  translation,
  statusTranslation,
  headingLevel,
  id,
  query,
  status,
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
                translation={translation}
                statusTranslation={statusTranslation}
                id={searchFormID}
                defaultQuery={{ query, status }}
                onSearch={onSearch}
              />
            )}
          </div>

          <div className={styles.header}>
            <Button onClick={() => switchNewForm((old) => !old)}>{add}</Button>
            {isNewFormShown && (
              <NewTaskForm
                commonTranslation={commonTranslation}
                translation={translation}
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
