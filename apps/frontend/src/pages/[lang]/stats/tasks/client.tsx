

import type { ILocalization } from "#lib/localization";
import { TasksStats } from "#entities/task";
import type { ILocalizableProps, ITranslatableProps } from "#components/types";

interface IProps extends ILocalizableProps, ITranslatableProps {
  translation: ILocalization["stats_tasks"];
}

export function Client({ language, commonTranslation, translation }: IProps) {
  return (
    <TasksStats
      language={language}
      commonTranslation={commonTranslation}
      translation={translation}
    />
  );
}
