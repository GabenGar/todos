import { Suspense } from "react";
import type { Metadata } from "next";
import { getDictionary } from "#server";
import { Loading, Page } from "#components";
import type { IStaticPageProps } from "#pages/types";
import { Client } from "./client";

interface IProps extends IStaticPageProps {}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { task } = dict;

  return {
    title: `${task.title}`,
  };
}

async function TaskDetailsPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { task, common } = dict;

  return (
    <Page heading={task.heading}>
      <Suspense fallback={<Loading />}>
        <Client language={lang} commonTranslation={common} translation={task} />
      </Suspense>
    </Page>
  );
}

export default TaskDetailsPage;
