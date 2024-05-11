"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  type ILocalizableProps,
  type ITranslatableProps,
} from "#components/types";
import { type ITaskDetailsProps, TaskDetails } from "#entities/task";

interface IProps
  extends ILocalizableProps,
    ITranslatableProps,
    Pick<ITaskDetailsProps, "translation"> {}

export function Client({ language, commonTranslation, translation }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskID = searchParams.get("task_id")?.trim();

  if (!taskID) {
    router.replace("/404");

    return null;
  }

  return (
    <TaskDetails
      language={language}
      commonTranslation={commonTranslation}
      translation={translation}
      headingLevel={2}
      taskID={taskID}
    />
  );
}
