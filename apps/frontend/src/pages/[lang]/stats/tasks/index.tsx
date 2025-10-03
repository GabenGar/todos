import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { getDictionary } from "#lib/localization";
import type { ILocalizedParams, ILocalizedProps } from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { TasksStats } from "#entities/task";

interface IProps extends ILocalizedProps<"stats_tasks"> {}

interface IParams extends ILocalizedParams {}

function TasksStatsPage({
  translation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { lang, common, t } = translation;
  const title = t.title;
  const description = t.description;

  return (
    <Page heading={t.heading} title={title} description={description}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <OverviewHeader>
            <TasksStats
              language={lang}
              commonTranslation={common}
              translation={t}
            />
          </OverviewHeader>
        )}
      </Overview>
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
      t: dict.pages["stats_tasks"],
    },
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default TasksStatsPage;
