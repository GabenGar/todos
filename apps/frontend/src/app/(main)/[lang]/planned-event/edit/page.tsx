import { Suspense } from "react";
import type { Metadata } from "next";
import { getDictionary } from "#server";
import { Loading, Page } from "#components";
import type { IBasePageParams } from "#pages/types";
import { Client } from "./client";

interface IParams extends IBasePageParams {}

interface IProps {
  params: IParams;
}

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { title } = dict.pages["planned-event_edit"];

  const metaData: Metadata = {
    title,
  };

  return metaData;
}

async function PlannedEventEditPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { common, pages, entities } = dict;
  const { heading } = pages["planned-event_edit"];

  return (
    <Page heading={heading}>
      <Suspense fallback={<Loading />}>
        <Client
          language={lang}
          commonTranslation={common}
          translation={entities.planned_event}
        />
      </Suspense>
    </Page>
  );
}

export default PlannedEventEditPage;
