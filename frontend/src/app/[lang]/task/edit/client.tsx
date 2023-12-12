"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ILocalization } from "#lib/localization";
import { createTaskPageURL } from "#lib/urls";
import { Loading } from "#components";
import type { ITranslatableProps } from "#components/types";
import { Details, DetailsBody, DetailsHeader } from "#components/details";
import { Link } from "#components/link";
import { List, ListItem } from "#components/list";
import {
  EditTaskForm,
  editTask,
  type IEditTaskFormProps,
  getTask,
} from "#entities/task";

interface IProps
  extends ITranslatableProps,
    Pick<IEditTaskFormProps, "translation"> {
  pageTranslation: ILocalization["task_edit"];
}

export function Client({
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
                  <Link href={createTaskPageURL(currentTask.id)}>
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
        </>
      )}
    </Details>
  );
}
