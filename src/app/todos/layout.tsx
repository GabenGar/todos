import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "TODOs",
};

function TodosLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>TODOs</header>
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        <nav></nav>

        {children}
      </section>
      <footer>Repo Link</footer>
    </>
  );
}

export default TodosLayout;
