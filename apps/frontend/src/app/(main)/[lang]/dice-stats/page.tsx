import type { Metadata } from "next";
import { getDictionary } from "#server";
import { Page } from "#components";
import type { IBasePageParams } from "#pages/types";
import { Client } from "./client";

interface IProps {
  params: IParams;
}

interface IParams extends IBasePageParams {}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { pages } = dict;
  const { title } = pages["dice-stats"];

  const metaData: Metadata = {
    title,
  };

  return metaData;
}

async function DiceStatsPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { common, pages } = dict;
  const translation = pages["dice-stats"]
  const { heading } = translation;

  return (
    <Page heading={heading}>
      <Client commonTranslation={common} translation={translation} />
    </Page>
  );
}

export default DiceStatsPage;
