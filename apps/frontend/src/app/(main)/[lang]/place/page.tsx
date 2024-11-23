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
  const { place } = dict.pages;

  return {
    title: `${place.title}`,
  };
}

async function PlaceDetailsPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { pages, place, common, stats_tasks } = dict;

  return (
    <Page heading={pages.place.heading}>
      <Suspense fallback={<Loading />}>
        <Client
          language={lang}
          commonTranslation={common}
          translation={place}
          taskTranslation={stats_tasks}
        />
      </Suspense>
    </Page>
  );
}

export default PlaceDetailsPage;
