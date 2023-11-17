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
  const { title } = dict.pages.place_edit;

  const metaData: Metadata = {
    title,
  };

  return metaData;
}

async function PlaceEditPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { common, todos, task_edit } = dict;

  return (
    <Page heading={task_edit.heading}>
      <Client
        commonTranslation={common}
        translation={todos}
        pageTranslation={task_edit}
      />
    </Page>
  );
}

export default PlaceEditPage;
