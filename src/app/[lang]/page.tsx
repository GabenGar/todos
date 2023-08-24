import { type Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "#server";
import type { IBasePageParams } from "#pages/types";

interface IProps {
  params: IBasePageParams;
}

export const metadata: Metadata = {
  title: "Next.js",
};

async function FrontPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);

  return (
    <>
      <section>
        <header>
          <h1>{dict.home}</h1>
        </header>
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
