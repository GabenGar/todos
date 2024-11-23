import type { Metadata, ResolvingMetadata } from "next";
import { getDictionary } from "#server";
import { Page } from "#components";
import { Overview, OverviewHeader } from "#components/overview";
import type { IStaticPageProps } from "#pages/types";
import { PlacesStats } from "./list";

interface IProps extends IStaticPageProps {}

export async function generateMetadata(
  { params }: IProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { title, description } = dict.pages.stats_places;

  return {
    title: title,
    description: description,
  };
}

async function PlacesStatsPage({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { common, pages } = dict;
  const { stats_places } = pages;

  return (
    <Page heading={stats_places.heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <OverviewHeader>
            <PlacesStats
              language={lang}
              commonTranslation={common}
              translation={stats_places}
            />
          </OverviewHeader>
        )}
      </Overview>
    </Page>
  );
}

export default PlacesStatsPage;
