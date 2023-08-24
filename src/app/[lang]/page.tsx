import { type Metadata } from "next";
import Link from "next/link";
import { SITE_TITLE } from "#environment";
import { getDictionary } from "#server";
import type { IBasePageParams } from "#pages/types";

interface IProps {
  params: IBasePageParams;
}

export const metadata: Metadata = {
  title: `Hello NextJS! | ${SITE_TITLE}`,
};

async function FrontPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);

  return (
    <>
      <header>
        <h1>{dict.home}</h1>
      </header>
      <section>
        <ul>
          <li>
            <Link href="/todos">TODOs</Link>
          </li>
          <li>
            <Link href="/mdx">MDX</Link>
          </li>
        </ul>
      </section>
    </>
  );
}

export default FrontPage;
