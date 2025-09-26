import type { Metadata } from "next";
import { validateLocale } from "#lib/internationalization";
import { getDictionary } from "#lib/localization";
import { Page } from "#components";
import { Client } from "./client";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/account">): Promise<Metadata> {
  const { lang } = await params;
  validateLocale(lang);
  const dict = await getDictionary(lang);
  const { title } = dict.pages.account;

  return {
    title,
  };
}

async function PlaceDetailsPage({ params }: PageProps<"/[lang]/account">) {
  const { lang } = await params;
  validateLocale(lang);
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
