import type { Metadata, ResolvingMetadata } from "next";
import { getDictionary } from "#server";
import { Page } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import type { IBasePageParams } from "#pages/types";
import { Client } from "./client";

interface IProps {
  params: IBasePageParams;
}

export async function generateMetadata(
  { params }: IProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { stats_tasks } = dict;

  return {
    title: stats_tasks.title,
    description: stats_tasks.description,
  };
}

async function TasksStatsPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { common, stats_tasks } = dict;

  return (
    <Page heading={stats_tasks.heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <OverviewHeader>
            <Client
              language={lang}
              commonTranslation={common}
              translation={stats_tasks}
            />
          </OverviewHeader>
        )}
      </Overview>
    </Page>
  );
}

export default TasksStatsPage;
