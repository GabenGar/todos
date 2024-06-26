"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ILocalization } from "#lib/localization";
import { createPlacePageURL, createTasksPageURL } from "#lib/urls";
import { Details, Loading } from "#components";
import { PreviewList } from "#components/preview";
import {
  Overview,
  OverviewBody,
  OverviewHeader,
  type IOverviewProps,
} from "#components/overview";
import {
  type ILocalizableProps,
  type ITranslatableProps,
} from "#components/types";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import { IPlace, getPlace } from "#entities/place";
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
  extends ILocalizableProps,
    ITranslatableProps,
    Pick<IOverviewProps, "headingLevel"> {
  translation: ILocalization["todos"];
  taskTranslation: ILocalization["task"];
  statusTranslation: ILocalization["stats_tasks"]["status_values"];
  id: string;
}

/**
 * @TODO move the state out of the component
 */
export function TaskList({
  language,
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
  const inputPlaceID = searchParams.get("place_id")?.trim();
  const placeID = !inputPlaceID ? undefined : inputPlaceID;
  const options: Required<Parameters<typeof getTasks>>[0] = {
    includeDeleted: false,
    page,
    query,
    status,
    placeID,
  };

  useEffect(() => {
    (async () => {
      const newTasks = await getTasks(options);

      // short circuit if nothing found
      if (newTasks.pagination.totalCount === 0) {
        changeTasks(newTasks);
        return;
      }

      if (page !== newTasks.pagination.currentPage) {
        const newTasksURL = createTasksPageURL(language, {
          page: newTasks.pagination.currentPage,
          query: options.query,
          placeID: options.placeID,
          status: options.status,
        });

        router.replace(newTasksURL);

        return;
      }

      changeTasks(newTasks);
    })();
  }, [page, query, status, placeID]);

  async function handleTaskCreation(init: ITaskInit) {
    await createTask(init);
    const newTasks = await getTasks(options);

    if (newTasks.pagination.totalPages !== tasks?.pagination.totalPages) {
      const newOptions: Required<Parameters<typeof createTasksPageURL>>[1] = {
        query: options.query,
        placeID: options.placeID,
        status: options.status,
        page: newTasks.pagination.totalPages,
      };
      const newURL = createTasksPageURL(language, newOptions);
      router.replace(newURL);

      return;
    }

    changeTasks(newTasks);
  }

  async function handleTaskSearch(newQuery: ITaskSearchQuery) {
    const { pagination } = await getTasks({
      includeDeleted: false,
      query: newQuery.query,
      status: newQuery.status,
      placeID: newQuery.place_id,
    });

    const newURL = createTasksPageURL(language, {
      page: pagination.currentPage,
      query: newQuery.query,
      status: newQuery.status,
      placeID: newQuery.place_id,
    });

    router.replace(newURL);
  }

  return (
    <>
      <Forms
        language={language}
        commonTranslation={commonTranslation}
        translation={translation}
        statusTranslation={statusTranslation}
        headingLevel={headingLevel}
        id={id}
        query={query}
        status={status}
        placeID={placeID}
        onNewTask={handleTaskCreation}
        onSearch={handleTaskSearch}
      />

      {!tasks ? (
        <Overview headingLevel={headingLevel}>
          {() => (
            <OverviewHeader>
              <Loading />
            </OverviewHeader>
          )}
        </Overview>
      ) : (
        <PreviewList
          commonTranslation={commonTranslation}
          pagination={tasks.pagination}
          buildURL={(page) => {
            const url = createTasksPageURL(language, {
              ...options,
              page,
            });

            return url;
          }}
          sortingOrder="descending"
        >
          {tasks.items.map((task) => (
            <TaskPreview
              key={task.id}
              language={language}
              commonTranslation={commonTranslation}
              headingLevel={headingLevel}
              translation={taskTranslation}
              task={task}
            />
          ))}
        </PreviewList>
      )}
    </>
  );
}

interface IFormsProps
  extends Pick<
      IProps,
      | "language"
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
  placeID?: IPlace["id"];
}

function Forms({
  language,
  commonTranslation,
  translation,
  statusTranslation,
  headingLevel,
  id,
  query,
  status,
  placeID,
  onNewTask,
  onSearch,
}: IFormsProps) {
  const [place, changePlace] = useState<Awaited<ReturnType<typeof getPlace>>>();
  const { add, search } = translation;
  const newFormID = `${id}-task-list-new`;
  const searchFormID = `${id}-task-list-search`;

  useEffect(() => {
    // do not fetch new place if it's the same or undefined
    if (!placeID) {
      changePlace(undefined);
      return;
    }

    (async () => {
      const newPlace = await getPlace(placeID);
      changePlace(newPlace);
    })();
  }, [placeID]);

  return (
    <Overview headingLevel={headingLevel}>
      {() => (
        <>
          {place && (
            <OverviewHeader>
              <List>
                <ListItem>
                  <Link href={createPlacePageURL(language, place.id)}>
                    {translation.new_todo.place}
                  </Link>
                </ListItem>
              </List>
            </OverviewHeader>
          )}

          <OverviewBody>
            <Details summary={search}>
              <SearchTasksForm
                language={language}
                commonTranslation={commonTranslation}
                translation={translation}
                statusTranslation={statusTranslation}
                id={searchFormID}
                defaultQuery={{ query, status }}
                place={place}
                onSearch={onSearch}
              />
            </Details>

            <Details summary={add}>
              <NewTaskForm
                language={language}
                commonTranslation={commonTranslation}
                translation={translation}
                id={newFormID}
                place={place}
                onNewTask={onNewTask}
              />
            </Details>
          </OverviewBody>
        </>
      )}
    </Overview>
  );
}
