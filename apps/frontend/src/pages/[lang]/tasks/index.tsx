import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { getDictionary, type ILocalization } from "#lib/localization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { TaskList } from "#entities/task";

interface IProps extends ILocalizedProps<"tasks"> {
  taskTranslation: ILocalization["pages"]["task"];
  statusTranslation: ILocalization["pages"]["stats_tasks"];
}

interface IParams extends ILocalizedParams {}

function TasksPage({
  translation,
  taskTranslation,
  statusTranslation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { lang, common, t } = translation;
  const title = t.title;

  return (
    <Page heading={t.heading} title={title}>
      <TaskList
        language={lang}
        commonTranslation={common}
        headingLevel={2}
        taskTranslation={taskTranslation}
        statusTranslation={statusTranslation.status_values}
        translation={t}
        id="tasks"
      />
    </Page>
  );
}

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({
  params,
}) => {
  const { lang } = params!;
  const dict = await getDictionary(lang);
  const props = {
    translation: {
      lang,
      common: dict.common,
      t: dict.pages["tasks"],
    },
    taskTranslation: dict.pages.task,
    statusTranslation: dict.pages.stats_tasks,
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default TasksPage;
