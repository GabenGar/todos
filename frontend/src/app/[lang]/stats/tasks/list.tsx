"use client";

import { useState, useEffect } from "react";
import type { ILocalization } from "#lib/localization";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { TaskStatus, getTasksStats } from "#entities/task";
import { Link } from "#components/link";
import type { ITranslatableProps } from "#components/types";
import { createTasksPageURL } from "#lib/urls";

interface IProps extends ITranslatableProps {
  translation: ILocalization["stats_tasks"];
}

export function TasksStats({ commonTranslation, translation }: IProps) {
  const { status_values } = translation;
  const [stats, changeStats] =
    useState<Awaited<ReturnType<typeof getTasksStats>>>();

  useEffect(() => {
    (async () => {
      const newStats = await getTasksStats();
      changeStats(newStats);
    })();
  }, []);

  return (
    <DescriptionList>
      <DescriptionSection
        isHorizontal
        dKey={status_values.all}
        dValue={
          !stats ? (
            <Loading />
          ) : stats.all === 0 ? (
            <span>{stats.all}</span>
          ) : (
            <Link href={createTasksPageURL()}>{stats.all}</Link>
          )
        }
      />

      <DescriptionSection
        isHorizontal
        dKey={<TaskStatus translation={status_values} status={"in-progress"} />}
        dValue={
          !stats ? (
            <Loading />
          ) : stats["in-progress"] === 0 ? (
            <span>{stats["in-progress"]}</span>
          ) : (
            <Link href={createTasksPageURL({ status: "in-progress" })}>
              {stats["in-progress"]}
            </Link>
          )
        }
      />

      <DescriptionSection
        isHorizontal
        dKey={<TaskStatus translation={status_values} status={"pending"} />}
        dValue={
          !stats ? (
            <Loading />
          ) : stats.pending === 0 ? (
            <span>{stats.pending}</span>
          ) : (
            <Link href={createTasksPageURL({ status: "pending" })}>
              {stats.pending}
            </Link>
          )
        }
      />

      <DescriptionSection
        isHorizontal
        dKey={<TaskStatus translation={status_values} status={"finished"} />}
        dValue={
          !stats ? (
            <Loading />
          ) : stats.finished === 0 ? (
            <span>{stats.finished}</span>
          ) : (
            <Link href={createTasksPageURL({ status: "finished" })}>
              {stats.finished}
            </Link>
          )
        }
      />

      <DescriptionSection
        isHorizontal
        dKey={<TaskStatus translation={status_values} status={"failed"} />}
        dValue={
          !stats ? (
            <Loading />
          ) : stats.failed === 0 ? (
            <span>{stats.failed}</span>
          ) : (
            <Link href={createTasksPageURL({ status: "failed" })}>
              {stats.failed}
            </Link>
          )
        }
      />
    </DescriptionList>
  );
}
