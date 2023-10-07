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
  const { place } = dict.pages;

  return {
    title: `${place.title}`,
  };
}

async function PlaceDetailsPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { pages, place } = dict;

  return (
    <Page heading={pages.place.heading}>
      <Client translation={place} />
    </Page>
  );
}

export default PlaceDetailsPage;
