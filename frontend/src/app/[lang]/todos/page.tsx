import type { Metadata } from "next";
import { getDictionary } from "#server";
import { Heading } from "#components/heading";
import { TodoList } from "#entities/todo";
import { DataExportForm } from "#entities/data-export";
import type { IBasePageParams } from "#pages/types";

import styles from "../page.module.scss";

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
        <TodoList id={"todos"} />
        <DataExportForm />
      </section>
    </>
  );
}

export default TodosPage;
