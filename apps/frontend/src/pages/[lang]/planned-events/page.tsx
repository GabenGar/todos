import { Suspense } from "react";
import { type Metadata } from "next";
import { getDictionary } from "#server";
import { Loading, Page } from "#components";
import type { IStaticPageProps } from "#pages/types";
import { Client } from "./client";

interface IProps extends IStaticPageProps {}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const page = dict.pages["planned-events"];

  const data: Metadata = {
    title: page.title,
  };

  return data;
}

async function PlannedEventsPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { pages, common, entities } = dict;
  const page = pages["planned-events"];
  const entity = entities.planned_event;

  return (
    <Page heading={page.heading}>
      <Suspense fallback={<Loading />}>
        <Client
          language={lang}
          commonTranslation={common}
          translation={entity}
        />
      </Suspense>
    </Page>
  );
}

export default PlannedEventsPage;
