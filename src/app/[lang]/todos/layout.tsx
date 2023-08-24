import { IBaseLayoutProps } from "#pages/types";
import { type Metadata } from "next";

interface IProps extends IBaseLayoutProps {}

export const metadata: Metadata = {
  title: "TODOs",
  description: "The list of TODOs",
};

function TodosLayout({ children }: IProps) {
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
