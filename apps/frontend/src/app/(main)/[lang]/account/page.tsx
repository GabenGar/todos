import type { Metadata } from "next";
import { getDictionary } from "#server";
import { Page } from "#components";
import type { IStaticPageProps } from "#pages/types";
import { Client } from "./client";

interface IProps extends IStaticPageProps {}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { title } = dict.pages.account;

  return {
    title,
  };
}

async function PlaceDetailsPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { pages, common } = dict;
  const { heading } = pages.account;

  return (
    <Page heading={heading}>
      <Client commonTranslation={common} translation={pages.account} />
    </Page>
  );
}

export default PlaceDetailsPage;
