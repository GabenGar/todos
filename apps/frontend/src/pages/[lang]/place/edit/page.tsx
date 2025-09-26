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
  const { title } = dict.pages.place_edit;

  const metaData: Metadata = {
    title,
  };

  return metaData;
}

async function PlaceEditPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { common, pages, place } = dict;
  const { heading } = pages.place_edit;

  return (
    <Page heading={heading}>
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

export default PlaceEditPage;
