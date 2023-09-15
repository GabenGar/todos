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
import { TaskStatus } from "./status";

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

  const { id, title, description, created_at, updated_at, status } = task;

  return (
    <Article {...props}>
      {(headinglevel) => (
        <>
          <ArticleHeader>
            <Heading level={headinglevel}>{title}</Heading>
            <div>{id}</div>
          </ArticleHeader>
          <ArticleBody>
            <DescriptionList>
              <DescriptionSection
                isHorizontal
                dKey={translation.status}
                dValue={
                  <TaskStatus
                    translation={translation.status_values}
                    status={status}
                  />
                }
              />
              <DescriptionSection
                dKey={translation.description}
                dValue={description ?? translation.no_description}
              />
            </DescriptionList>
            <hr style={{ width: "100%" }} />
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
          </ArticleBody>
          <ArticleFooter>
            <ul>
              <li>
                <Link href="/tasks">{translation.back_to_tasks}</Link>
              </li>
            </ul>
          </ArticleFooter>
        </>
      )}
    </Article>
  );
}
