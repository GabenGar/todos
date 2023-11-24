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
  const { title } = dict.pages.account;

  return {
    title,
  };
}

async function PlaceDetailsPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { pages, common } = dict;
  const { heading } = pages.account;

  return (
    <Page heading={heading}>
      <Client
        commonTranslation={common}
      />
    </Page>
  );
}

export default PlaceDetailsPage;
