import { type Metadata } from "next";
import { SITE_TITLE } from "#environment";
import { getDictionary } from "#server";
import { Page } from "#components";
import { Article, ArticleHeader } from "#components/article";
import { Link } from "#components/link";
import type { IBasePageParams } from "#pages/types";

interface IProps {
  params: IBasePageParams;
}

export const metadata: Metadata = {
  title: `Welcome to ${SITE_TITLE}!`,
};

async function FrontPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { home } = dict;

  return (
    <Page heading={home.heading}>
      <Article>
        <ArticleHeader>
          <ul>
            <li>
              <Link href={`/todos`}>{home.link_tasks}</Link>
            </li>
          </ul>
        </ArticleHeader>
      </Article>
    </Page>
  );
}

export default FrontPage;
