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
  const { qr_code_reader } = pages;

  const metaData: Metadata = {
    title: qr_code_reader.title,
    description: qr_code_reader.description,
  };

  return metaData;
}

async function QRCodeReaderPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { common, pages } = dict;
  const { qr_code_reader } = pages;

  return (
    <Page heading={qr_code_reader.heading}>
      <Client commonTranslation={common} translation={qr_code_reader} />
    </Page>
  );
}

export default QRCodeReaderPage;
