import type { INanoidID } from "#lib/strings";
import { getDictionary } from "#server";
import { Page } from "#components";
import { TaskDetails } from "#entities/task";
import type { IBasePageParams } from "#pages/types";

interface IParams extends IBasePageParams {
  task_id: INanoidID;
}

interface IProps {
  params: IParams;
}

export async function generateMetadata({ params }: IProps) {
  const { lang, task_id } = params;
  const dict = await getDictionary(lang);
  const { task } = dict;

  return {
    title: `${task.title} "${task_id}"`,
  };
}

async function TaskDetailsPage({ params }: IProps) {
  const { lang, task_id } = params;
  const dict = await getDictionary(lang);
  const { task } = dict;

  return (
    <Page heading={task.heading}>
      <TaskDetails translation={task} headingLevel={2} taskID={task_id} />
    </Page>
  );
}

export default TaskDetailsPage;
