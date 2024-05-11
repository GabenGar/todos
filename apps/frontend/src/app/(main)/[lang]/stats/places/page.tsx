import type { Metadata, ResolvingMetadata } from "next";
import { getDictionary } from "#server";
import { Page } from "#components";
import { Details, DetailsHeader } from "#components/details";
import type { IBasePageParams } from "#pages/types";
import { PlacesStats } from "./list";

interface IProps {
  params: IBasePageParams;
}

export async function generateMetadata(
  { params }: IProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { title, description } = dict.pages.stats_places;

  return {
    title: title,
    description: description,
  };
}

async function PlacesStatsPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { common, pages } = dict;
  const { stats_places } = pages;

  return (
    <Page heading={stats_places.heading}>
      <Details headingLevel={2}>
        {(headingLevel) => (
          <DetailsHeader>
            <PlacesStats
              language={lang}
              commonTranslation={common}
              translation={stats_places}
            />
          </DetailsHeader>
        )}
      </Details>
    </Page>
  );
}

export default PlacesStatsPage;
