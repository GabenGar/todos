"use client";

import { useEffect, useState } from "react";
import { INanoidID } from "#lib/strings";
import { ILocalization } from "#lib/localization";
import {
  Article,
  ArticleBody,
  ArticleFooter,
  ArticleHeader,
  type IArticleProps,
} from "#components/article";
import { createBlockComponent } from "#components/meta";
import { Loading } from "#components";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import { getTask } from "./lib";

import styles from "./details.module.scss";

interface IProps extends IArticleProps {
  translation: ILocalization["task"];
  taskID: INanoidID;
}

export const TaskDetails = createBlockComponent(styles, Component);

function Component({ translation, taskID, ...props }: IProps) {
  const [task, changeTask] = useState<Awaited<ReturnType<typeof getTask>>>();

  useEffect(() => {
    getTask(taskID).then((task) => changeTask(task));
  }, [taskID]);

  if (!task) {
    return (
      <Article {...props}>
        {(headinglevel) => (
          <>
            <ArticleHeader>
              <Loading />
            </ArticleHeader>
            <ArticleBody>
              <Loading />
            </ArticleBody>
            <ArticleFooter>
              <Loading />
            </ArticleFooter>
          </>
        )}
      </Article>
    );
  }

  const { id, title, description, created_at, updated_at } = task;

  return (
    <Article {...props}>
      {(headinglevel) => (
        <>
          <ArticleHeader>
            <Heading level={headinglevel}>
              <div>&quot;{title}&quot;</div>
              <div>{id}</div>
            </Heading>
          </ArticleHeader>
          <ArticleBody>
            <dl>
              <dt>{translation.description}:</dt>
              <dd>{description ?? translation.no_description}</dd>
            </dl>
          </ArticleBody>
          <ArticleFooter>
            <dl>
              <dt>{translation.creation_date}:</dt>
              <dd>{created_at}</dd>
              <dt>{translation.last_updated}:</dt>
              <dd>{updated_at}</dd>
            </dl>
            <ul>
              <li>
                <Link href={"/todos"}>{translation.back_to_tasks}</Link>
              </li>
            </ul>
          </ArticleFooter>
        </>
      )}
    </Article>
  );
}
