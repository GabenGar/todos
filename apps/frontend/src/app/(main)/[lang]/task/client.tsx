"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ITranslatableProps } from "#components/types";
import { type ITaskDetailsProps, TaskDetails } from "#entities/task";

interface IProps
  extends ITranslatableProps,
    Pick<ITaskDetailsProps, "translation"> {}

export function Client({ commonTranslation, translation }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskID = searchParams.get("task_id")?.trim();

  if (!taskID) {
    router.replace("/404");

    return null;
  }

  return (
    <TaskDetails
      commonTranslation={commonTranslation}
      translation={translation}
      headingLevel={2}
      taskID={taskID}
    />
  );
}
