"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ILocalization } from "#lib/localization";
import { createPlacePageURL, createTasksPageURL } from "#lib/urls";
import { Loading } from "components/loading";
import { PreviewList } from "#components/preview";
import {
  Details,
  DetailsBody,
  DetailsHeader,
  type IDetailsProps,
} from "#components/details";
import { type ITranslatableProps } from "#components/types";
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
  extends ITranslatableProps,
    Pick<IDetailsProps, "headingLevel"> {
  translation: ILocalization["todos"];
  taskTranslation: ILocalization["task"];
  statusTranslation: ILocalization["stats_tasks"]["status_values"];
  id: string;
}

/**
 * @TODO move the state out of the component
 */
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
        const newTasksURL = createTasksPageURL({
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
      const newOptions: Required<Parameters<typeof createTasksPageURL>>[0] = {
        query: options.query,
        placeID: options.placeID,
        status: options.status,
        page: newTasks.pagination.totalPages,
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
      status: newQuery.status,
      placeID: newQuery.place_id,
    });

    const newURL = createTasksPageURL({
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

/**
 * @TODO switch to `<details>` component
 */
function Forms({
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
    <Details headingLevel={headingLevel}>
      {() => (
        <>
          {place && (
            <DetailsHeader>
              <List>
                <ListItem>
                  <Link href={createPlacePageURL(place.id)}>
                    {translation.new_todo.place}
                  </Link>
                </ListItem>
              </List>
            </DetailsHeader>
          )}

          <DetailsBody>
            <details>
              <summary style={{ cursor: "pointer" }}>{search}</summary>
              <SearchTasksForm
                commonTranslation={commonTranslation}
                translation={translation}
                statusTranslation={statusTranslation}
                id={searchFormID}
                defaultQuery={{ query, status }}
                place={place}
                onSearch={onSearch}
              />
            </details>

            <details>
              <summary style={{ cursor: "pointer" }}>{add}</summary>
              <NewTaskForm
                commonTranslation={commonTranslation}
                translation={translation}
                id={newFormID}
                place={place}
                onNewTask={onNewTask}
              />
            </details>
          </DetailsBody>
        </>
      )}
    </Details>
  );
}
