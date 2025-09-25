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
  const { places } = dict.pages;

  const data: Metadata = {
    title: places.title,
  };

  return data;
}

async function PlacesPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { pages, common, place } = dict;
  const { places } = pages;

  return (
    <Page heading={places.heading}>
      <Suspense fallback={<Loading />}>
        <Client
          language={lang}
          commonTranslation={common}
          translation={place}
        />
      </Suspense>
    </Page>
  );
}

export default PlacesPage;
