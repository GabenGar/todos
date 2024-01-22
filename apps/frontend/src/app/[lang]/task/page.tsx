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
  const { task } = dict;

  return {
    title: `${task.title}`,
  };
}

async function TaskDetailsPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { task, common } = dict;

  return (
    <Page heading={task.heading}>
      <Client commonTranslation={common} translation={task} />
    </Page>
  );
}

export default TaskDetailsPage;
