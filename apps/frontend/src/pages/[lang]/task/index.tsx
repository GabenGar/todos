import { useEffect } from "react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { getDictionary } from "#lib/localization";
import {
  getSingleValueFromQuery,
  type ILocalizedParams,
  type ILocalizedProps,
} from "#lib/pages";
import { getStaticExportPaths } from "#server";
import { Page } from "#components";
import { TaskOverview } from "#entities/task";

interface IProps extends ILocalizedProps<"task"> {}

interface IParams extends ILocalizedParams {}

function TaskDetailsPage({
  translation,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const { isReady, query } = router;
  const { lang, common, t } = translation;
  const title = t.title;
  const taskID = getSingleValueFromQuery(query, "task_id")!;

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
    <Page heading={t.heading} title={title}>
      <TaskOverview
        language={lang}
        commonTranslation={common}
        translation={t}
        headingLevel={2}
        taskID={taskID}
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
      t: dict.pages["task"],
    },
  } satisfies IProps;

  return {
    props,
  };
};

export const getStaticPaths = getStaticExportPaths;

export default TaskDetailsPage;
