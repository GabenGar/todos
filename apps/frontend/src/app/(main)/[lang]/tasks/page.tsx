import { Suspense } from "react";
import { getDictionary } from "#server";
import { TaskList } from "#entities/task";
import { Loading, Page } from "#components";
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
  const { common, todos, task, stats_tasks } = dict;

  return (
    <Page heading={todos.heading}>
      <Suspense fallback={<Loading />}>
        <TaskList
          language={lang}
          commonTranslation={common}
          headingLevel={2}
          taskTranslation={task}
          statusTranslation={stats_tasks.status_values}
          translation={todos}
          id="tasks"
        />
      </Suspense>
    </Page>
  );
}

export default TodosPage;
