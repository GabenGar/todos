import { type Metadata } from "next";
import Link from "next/link";
import { SITE_TITLE } from "#environment";
import { getDictionary } from "#server";
import { Heading } from "#components/heading";
import { Article, ArticleHeader } from "#components/article";
import type { IBasePageParams } from "#pages/types";

import styles from "./page.module.scss";

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
    <>
      <Heading level={1}>{home.heading}</Heading>
      <section className={styles.block}>
        <Article>
          <ArticleHeader>
            <ul>
              <li>
                <Link href={`/${lang}/todos`}>{home.link_tasks}</Link>
              </li>
            </ul>
          </ArticleHeader>
        </Article>
      </section>
    </>
  );
}

export default FrontPage;
