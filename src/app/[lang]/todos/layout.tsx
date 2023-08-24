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
      <section>
        <header>TODOs</header>
        {children}
      </section>
    </>
  );
}

export default TodosLayout;
