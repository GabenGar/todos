import { Suspense } from "react";
import { getDictionary } from "#lib/localization";
import { TaskList } from "#entities/task";
import { Loading, Page } from "#components";
import type { IStaticPageProps } from "#pages/types";

interface IProps extends IStaticPageProps {}

export async function generateMetadata({ params }: IProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { todos } = dict;

  return {
    title: todos.title,
  };
}

async function TodosPage({ params }: IProps) {
  const { lang } = await params;
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
