import type { Metadata } from "next";
import { getDictionary } from "#server";
import { Page } from "#components";
import type { IStaticPageProps } from "#pages/types";
import { Client } from "./client";

interface IProps extends IStaticPageProps {}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { title } = dict.pages["url-viewer"];

  return {
    title: `${title}`,
  };
}

async function URLViewerPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { common, pages } = dict;
  const { heading } = dict.pages["url-viewer"];

  return (
    <Page heading={heading}>
      <Client commonTranslation={common} translation={pages["url-viewer"]} />
    </Page>
  );
}

export default URLViewerPage;
