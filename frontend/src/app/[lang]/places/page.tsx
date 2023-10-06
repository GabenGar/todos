import { type Metadata } from "next";
import { getDictionary } from "#server";
import { Page } from "#components";
import type { IBasePageParams } from "#pages/types";
import { Client } from "./client";

interface IProps {
  params: IBasePageParams;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { places } = dict.pages;

  const data: Metadata = {
    title: places.title,
  };

  return data;
}

async function PlacesPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { pages, common, place } = dict;
  const { places } = pages;

  return (
    <Page heading={places.heading}>
      <Client commonTranslation={common} translation={place} />
    </Page>
  );
}

export default PlacesPage;
