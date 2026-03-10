import type { InferGetStaticPropsType } from "next";
import { Page } from "#components";
import { TaskList } from "#entities/task";
import { usePageTranslation } from "#hooks";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function TasksPage({ lang }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-tasks");
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);

  return (
    <Page heading={heading} title={title}>
      <TaskList language={lang} headingLevel={2} id="tasks" />
    </Page>
  );
}

export const getStaticProps = createGetStaticProps("page-tasks");

export const getStaticPaths = getStaticExportPaths;

export default TasksPage;
