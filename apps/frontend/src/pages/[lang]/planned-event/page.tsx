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
  const page = dict.pages["planned-event"];

  return {
    title: `${page.title}`,
  };
}

async function PlannedEventPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { pages, common, entities } = dict;
  const page = pages["planned-event"];
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

export default PlannedEventPage;
