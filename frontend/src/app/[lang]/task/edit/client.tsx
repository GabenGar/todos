"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { EditTaskForm, ITaskDetailsProps, TaskDetails } from "#entities/task";

interface IProps extends Pick<ITaskDetailsProps, "translation"> {}

export function Client({ translation }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskID = searchParams.get("task_id")?.trim();

  if (!taskID) {
    router.replace("/404");

    return null;
  }

  return <EditTaskForm />;
}
