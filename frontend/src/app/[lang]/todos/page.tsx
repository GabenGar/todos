import { getDictionary } from "#server";
import { TodoList } from "#entities/todo";
import { Page } from "#components";
import type { IBasePageParams } from "#pages/types";

interface IProps {
  params: IBasePageParams;
}

export async function generateMetadata({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { todos } = dict;

  return {
    title: todos.title,
  };
}

async function TodosPage({ params }: IProps) {
  const { lang } = params;
  const dict = await getDictionary(lang);
  const { todos } = dict;

  return (
    <Page heading={todos.heading}>
      <TodoList headingLevel={2} translation={todos} id={"todos"} />
    </Page>
  );
}

export default TodosPage;
