import type { Metadata } from "next";
import { getDictionary } from "#server";
import { Heading } from "#components/heading";
import { Article, ArticleHeader } from "#components/article";
import { TodoList } from "#entities/todo";
import { DataExportForm, ImportDataExportForm } from "#entities/data-export";
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
        <TodoList id={"todos"} />
        <Article>
          <ArticleHeader>
            <ul className={styles.buttons}>
              <DataExportForm />
              <ImportDataExportForm id="import-data-export" />
            </ul>
          </ArticleHeader>
        </Article>
      </section>
    </>
  );
}

export default TodosPage;
