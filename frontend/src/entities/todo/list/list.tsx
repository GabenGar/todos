"use client";

import { useState, useEffect } from "react";
import type { ILocalization } from "#lib/localization";
import {
  Article,
  ArticleBody,
  ArticleFooter,
  ArticleHeader,
  type IArticleProps,
} from "#components/article";
import { Loading } from "components/loading";
import { DataExportForm, ImportDataExportForm } from "#entities/data-export";
import { NewTodoForm } from "./new-todo";
import { TodoItem } from "./item";
import { createTodo, getTodos, removeTodo } from "../lib";
import type { ITodo, ITodoInit } from "../types";

import styles from "./list.module.scss";

interface ITodoListProps extends IArticleProps {
  translation: ILocalization["todos"];
  id: string;
}

export function TodoList({ translation, id, ...props }: ITodoListProps) {
  const [isInitialized, changeInitialization] = useState(false);
  const [tasks, changeTasks] = useState<ITodo[]>([]);
  const todoListID = `${id}-todolist`;

  useEffect(() => {
    getTodos().then((storedTodos) => changeTasks(storedTodos));
    changeInitialization(true);
  }, []);

  async function handleTodoCreation(init: ITodoInit) {
    if (!isInitialized) {
      return;
    }

    await createTodo(init);
    const newTodos = await getTodos();
    changeTasks(newTodos);
  }

  async function handleTodoRemoval(removedID: ITodo["id"]) {
    if (!isInitialized) {
      return;
    }

    await removeTodo(removedID);
    const newTodos = await getTodos();
    changeTasks(newTodos);
  }

  return (
    <Article {...props}>
      <ArticleHeader>
        <NewTodoForm
          translation={translation.new_todo}
          id={todoListID}
          onNewTodo={handleTodoCreation}
        />
      </ArticleHeader>

      <ArticleBody>
        <ul className={styles.list}>
          {!isInitialized ? (
            <Loading />
          ) : (
            tasks.map((task) => (
              <TodoItem
                key={task.id}
                translation={translation}
                task={task}
                onRemoval={handleTodoRemoval}
              />
            ))
          )}
        </ul>
      </ArticleBody>

      <ArticleFooter>
        <ul className={styles.buttons}>
          <DataExportForm translation={translation} />
          <ImportDataExportForm
            translation={translation}
            id="import-data-export"
            onSuccess={async () => {
              const newTodos = await getTodos();
              changeTasks(newTodos);
            }}
          />
        </ul>
      </ArticleFooter>
    </Article>
  );
}
