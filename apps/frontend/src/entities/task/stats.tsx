import { useState, useEffect } from "react";
import type { ILocalization } from "#lib/localization";
import { createTasksPageURL } from "#lib/urls";
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { TaskStatus, getTasksStats } from "#entities/task";
import { Link } from "#components/link";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";
import type { IPlace } from "#entities/place";

interface IProps extends ILocalizableProps, ITranslatableProps {
  translation: ILocalization["pages"]["stats_tasks"];
  placeID?: IPlace["id"];
}

export function TasksStats({ language, translation, placeID }: IProps) {
  const { status_values } = translation;
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
        dKey={status_values.all}
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
        dKey={<TaskStatus translation={status_values} status={"in-progress"} />}
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
        dKey={<TaskStatus translation={status_values} status={"pending"} />}
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
        dKey={<TaskStatus translation={status_values} status={"finished"} />}
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
        dKey={<TaskStatus translation={status_values} status={"failed"} />}
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
