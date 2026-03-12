import type { InferGetStaticPropsType } from "next";
import { Page } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import { TasksStats } from "#entities/task";
import { usePageTranslation } from "#hooks";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function TasksStatsPage({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-stats-tasks");
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);
  const description = t((t) => t.description);

  return (
    <Page heading={heading} title={title} description={description}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <TasksStats language={lang} />
          </OverviewHeader>
        )}
      </Overview>
    </Page>
  );
}

export const getStaticProps = createGetStaticProps("page-stats-tasks");

export const getStaticPaths = getStaticExportPaths;

export default TasksStatsPage;
