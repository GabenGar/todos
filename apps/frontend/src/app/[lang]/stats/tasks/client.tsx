"use client";

import type { ILocalization } from "#lib/localization";
import { TasksStats } from "#entities/task";
import type { ITranslatableProps } from "#components/types";

interface IProps extends ITranslatableProps {
  translation: ILocalization["stats_tasks"];
}

export function Client({ commonTranslation, translation }: IProps) {
  return (
    <TasksStats
      commonTranslation={commonTranslation}
      translation={translation}
    />
  );
}
