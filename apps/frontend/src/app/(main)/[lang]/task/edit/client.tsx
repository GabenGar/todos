"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ILocalization } from "#lib/localization";
import { createTaskPageURL, createTasksPageURL } from "#lib/urls";
import { Loading } from "#components";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import {
  Details,
  DetailsBody,
  DetailsFooter,
  DetailsHeader,
} from "#components/details";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import { Button } from "#components/button";
import {
  EditTaskForm,
  editTask,
  type IEditTaskFormProps,
  getTask,
  removeTask,
} from "#entities/task";

interface IProps
  extends ILocalizableProps,
    ITranslatableProps,
    Pick<IEditTaskFormProps, "translation"> {
  pageTranslation: ILocalization["task_edit"];
}

export function Client({
  language,
  commonTranslation,
  translation,
  pageTranslation,
}: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentTask, changeCurrentTask] =
    useState<Awaited<ReturnType<typeof getTask>>>();
  const taskID = searchParams.get("task_id")?.trim();

  useEffect(() => {
    if (!taskID) {
      router.replace("/404");
      return;
    }

    (async () => {
      const task = await getTask(taskID);
      changeCurrentTask(task);
    })();
  }, [taskID]);

  return (
    <Details headingLevel={2}>
      {(headingLevel) => (
        <>
          <DetailsHeader>
            <List>
              <ListItem>
                {!currentTask ? (
                  <Loading />
                ) : (
                  <Link href={createTaskPageURL(language, currentTask.id)}>
                    {pageTranslation.task}
                  </Link>
                )}
              </ListItem>
            </List>
          </DetailsHeader>

          <DetailsBody>
            {!currentTask ? (
              <Loading />
            ) : (
              <EditTaskForm
                language={language}
                commonTranslation={commonTranslation}
                translation={translation}
                id="edit-task"
                currentTask={currentTask}
                onTaskEdit={async (taskUpdate) => {
                  const editedTask = await editTask(taskUpdate);

                  changeCurrentTask(editedTask);
                }}
              />
            )}
          </DetailsBody>

          <DetailsFooter>
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
                      const url = createTasksPageURL(language);
                      router.push(url);
                    }}
                  >
                    {pageTranslation["Delete"]}
                  </Button>
                )}
              </ListItem>
            </List>
          </DetailsFooter>
        </>
      )}
    </Details>
  );
}
