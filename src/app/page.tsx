import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js",
};

function FrontPage() {
  return (
    <>
      <section>
        <header>
          <h1>Hello, Next.js!</h1>
        </header>
        <ul>
          <li>
            <Link href="/todos">TODOs</Link>
          </li>
        </ul>
      </section>
    </>
  );
}

export default FrontPage;
