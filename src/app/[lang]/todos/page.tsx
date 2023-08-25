import { getDictionary } from "#server";
import { Heading } from "#components/headings";
import { TodoList } from "#components/todo-list";

import type { Metadata } from "next";
import type { IBasePageParams } from "#pages/types";

interface IProps {
  params: IBasePageParams;
}

export const metadata: Metadata = {
  title: "TODOs",
};

async function TodosPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Heading level={1}>{dict.todos}</Heading>
      <section>
        <TodoList id={"todos"} />
      </section>
    </>
  );
}

export default TodosPage;
