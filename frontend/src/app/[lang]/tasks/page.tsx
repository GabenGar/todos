import { getDictionary } from "#server";
import { TaskList } from "#entities/task";
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
  const { common, todos } = dict;

  return (
    <Page heading={todos.heading}>
      <TaskList
        headingLevel={2}
        commonTraslation={common}
        translation={todos}
        id={"todos"}
      />
    </Page>
  );
}

export default TodosPage;
