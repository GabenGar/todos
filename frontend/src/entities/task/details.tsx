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
import { DescriptionList, DescriptionSection, Loading } from "#components";
import { Heading } from "#components/heading";
import { Link } from "#components/link";
import { DateTime } from "#components/date";
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
            <Heading level={headinglevel}>&quot;{title}&quot;</Heading>
            <div>{id}</div>
          </ArticleHeader>
          <ArticleBody>
            <DescriptionList>
              <DescriptionSection
                dKey={translation.description}
                dValue={description ?? translation.no_description}
              />
            </DescriptionList>
          </ArticleBody>
          <ArticleFooter>
            <DescriptionList>
              <DescriptionSection
                dKey={translation.creation_date}
                dValue={<DateTime dateTime={created_at} />}
              />
              <DescriptionSection
                dKey={translation.last_updated}
                dValue={<DateTime dateTime={updated_at} />}
              />
            </DescriptionList>
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
