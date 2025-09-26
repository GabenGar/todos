import { Suspense } from "react";
import type { Metadata } from "next";
import { getDictionary } from "#lib/localization";
import { Loading, Page } from "#components";
import type { IStaticPageProps } from "#pages/types";
import { Client } from "./client";

interface IProps extends IStaticPageProps {}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { task_edit } = dict;

  const metaData: Metadata = {
    title: `${task_edit.title}`,
  };

  return metaData;
}

async function TaskEditPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { common, todos, task_edit } = dict;

  return (
    <Page heading={task_edit.heading}>
      <Suspense fallback={<Loading />}>
        <Client
          language={lang}
          commonTranslation={common}
          translation={todos}
          pageTranslation={task_edit}
        />
      </Suspense>
    </Page>
  );
}

export default TaskEditPage;
