import { SITE_TITLE } from "#environment";
import {
  createPlacesPageURL,
  qrCodeReaderURL,
  taskStatsPageURL,
} from "#lib/urls";
import { getDictionary } from "#server";
import type { IStaticPageProps } from "#pages/types";
import { Page } from "#components";
import { Link } from "#components/link";
import { Details, DetailsHeader } from "#components/details";

interface IProps extends IStaticPageProps {}

export async function generateMetadata({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { home } = dict;

  return {
    title: `${home.title} | ${SITE_TITLE}`,
  };
}

async function FrontPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { home } = dict;

  return (
    <Page heading={home.heading}>
      <Details headingLevel={2}>
        {() => (
          <DetailsHeader>
            <ul>
              <li>
                <Link href={taskStatsPageURL}>{home.link_tasks}</Link>
              </li>
              <li>
                <Link href={createPlacesPageURL()}>{home.link_places}</Link>
              </li>
              <li>
                <Link href={qrCodeReaderURL}>{home.link_qr_code}</Link>
              </li>
            </ul>
          </DetailsHeader>
        )}
      </Details>
    </Page>
  );
}

export default FrontPage;
