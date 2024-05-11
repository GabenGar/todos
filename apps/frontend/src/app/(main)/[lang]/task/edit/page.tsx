import { Suspense } from "react";
import type { Metadata } from "next";
import { getDictionary } from "#server";
import { Page } from "#components";
import type { IBasePageParams } from "#pages/types";
import { Client } from "./client";

interface IParams extends IBasePageParams {}

interface IProps {
  params: IParams;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { task_edit } = dict;

  const metaData: Metadata = {
    title: `${task_edit.title}`,
  };

  return metaData;
}

async function TaskEditPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { common, todos, task_edit } = dict;

  return (
    <Page heading={task_edit.heading}>
      <Suspense>
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
