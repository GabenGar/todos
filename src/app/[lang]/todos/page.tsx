import { getDictionary } from "#server";
import { Heading } from "#components/heading";
import { TodoList } from "#components/todo-list";
import { Article } from "#components/article";

import type { Metadata } from "next";
import type { IBasePageParams } from "#pages/types";

import styles from "./page.module.scss";

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
      <section className={styles.block}>
        <Article>
          <TodoList id={"todos"} />
        </Article>
      </section>
    </>
  );
}

export default TodosPage;
