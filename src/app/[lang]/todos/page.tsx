import { type Metadata } from "next";
import { getDictionary } from "#server";
import { type IBasePageParams } from "#pages/types";
import { TodoList } from "#components/todo-list";

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
      <h1>{dict.todos}</h1>
      <section>
        <TodoList id={"todos"}/>
      </section>
    </>
  );
}

export default TodosPage;
