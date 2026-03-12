import { useEffect, useState } from "react";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Link } from "#components/link";
import type { ILocalizableProps } from "#components/types";
import type { IPlace } from "#entities/place";
import { getTasksStats, TaskStatus } from "#entities/task";
import { useTranslation } from "#hooks";
import { createTasksPageURL } from "#lib/urls";

interface IProps extends ILocalizableProps {
  placeID?: IPlace["id"];
}

export function TasksStats({ language, placeID }: IProps) {
  const { t } = useTranslation("translation");
  const [stats, changeStats] =
    useState<Awaited<ReturnType<typeof getTasksStats>>>();

  useEffect(() => {
    (async () => {
      const newStats = await getTasksStats(placeID);
      changeStats(newStats);
    })();
  }, [placeID]);

  return (
    <DescriptionList>
      <DescriptionSection
        isHorizontal
        dKey={t((t) => t.task.status_values.all)}
        dValue={
          !stats ? (
            <Loading />
          ) : (
            <Link href={createTasksPageURL(language, { placeID: placeID })}>
              {stats.all}
            </Link>
          )
        }
      />

      <DescriptionSection
        isHorizontal
        dKey={<TaskStatus status={"in-progress"} />}
        dValue={
          !stats ? (
            <Loading />
          ) : stats["in-progress"] === 0 ? (
            <span>{stats["in-progress"]}</span>
          ) : (
            <Link
              href={createTasksPageURL(language, {
                status: "in-progress",
                placeID: placeID,
              })}
            >
              {stats["in-progress"]}
            </Link>
          )
        }
      />

      <DescriptionSection
        isHorizontal
        dKey={<TaskStatus status={"pending"} />}
        dValue={
          !stats ? (
            <Loading />
          ) : stats.pending === 0 ? (
            <span>{stats.pending}</span>
          ) : (
            <Link
              href={createTasksPageURL(language, {
                status: "pending",
                placeID: placeID,
              })}
            >
              {stats.pending}
            </Link>
          )
        }
      />

      <DescriptionSection
        isHorizontal
        dKey={<TaskStatus status={"finished"} />}
        dValue={
          !stats ? (
            <Loading />
          ) : stats.finished === 0 ? (
            <span>{stats.finished}</span>
          ) : (
            <Link
              href={createTasksPageURL(language, {
                status: "finished",
                placeID: placeID,
              })}
            >
              {stats.finished}
            </Link>
          )
        }
      />

      <DescriptionSection
        isHorizontal
        dKey={<TaskStatus status={"failed"} />}
        dValue={
          !stats ? (
            <Loading />
          ) : stats.failed === 0 ? (
            <span>{stats.failed}</span>
          ) : (
            <Link
              href={createTasksPageURL(language, {
                status: "failed",
                placeID: placeID,
              })}
            >
              {stats.failed}
            </Link>
          )
        }
      />
    </DescriptionList>
  );
}
