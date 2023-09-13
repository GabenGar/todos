import { getDictionary } from "#server";
import { Heading } from "#components/heading";
import { TodoList } from "#entities/todo";
import type { IBasePageParams } from "#pages/types";

import styles from "../page.module.scss";

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
    <>
      <Heading level={1}>{todos.heading}</Heading>
      <section className={styles.block}>
        <TodoList translation={todos} id={"todos"} />
      </section>
    </>
  );
}

export default TodosPage;
