import { SITE_TITLE } from "#environment";
import { getDictionary } from "#server";
import { Page } from "#components";
import { Article, ArticleHeader } from "#components/article";
import { Link } from "#components/link";
import type { IBasePageParams } from "#pages/types";

interface IProps {
  params: IBasePageParams;
}

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
      <Article headingLevel={2}>
        {() => (
          <ArticleHeader>
            <ul>
              <li>
                <Link href={`/tasks`}>{home.link_tasks}</Link>
              </li>
            </ul>
          </ArticleHeader>
        )}
      </Article>
    </Page>
  );
}

export default FrontPage;
