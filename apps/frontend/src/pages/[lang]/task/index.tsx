import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { OverviewPlaceHolder } from "@repo/ui/articles";
import { Page } from "#components";
import { TaskOverview } from "#entities/task";
import { usePageTranslation } from "#hooks";
import { getSingleValueFromQuery } from "#lib/pages";
import { createGetStaticProps, getStaticExportPaths } from "#server";

function TaskDetailsPage({
  lang,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = usePageTranslation("page-task");
  const router = useRouter();
  const { isReady, query } = router;
  const title = t((t) => t.title);
  const heading = t((t) => t.heading);
  const taskID = getSingleValueFromQuery(query, "task_id");

  // biome-ignore lint/correctness/useExhaustiveDependencies: blah
  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!taskID) {
      router.replace("/404");

      return;
    }
  }, [isReady, taskID]);

  return (
    <Page heading={heading} title={title}>
      {!taskID ? (
        <OverviewPlaceHolder headingLevel={2} />
      ) : (
        <TaskOverview language={lang} headingLevel={2} taskID={taskID} />
      )}
    </Page>
  );
}

export const getStaticProps = createGetStaticProps("page-task");
export const getStaticPaths = getStaticExportPaths;

export default TaskDetailsPage;
