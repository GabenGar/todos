import { INanoidID } from "#lib/strings";
import { Article, IArticleProps } from "#components/article";
import { createBlockComponent } from "#components/meta";

interface IProps extends IArticleProps {
  taskID: INanoidID;
}

export const TaskDetails = createBlockComponent(undefined, Component);

function Component({ taskID, ...props }: IProps) {
  return <Article {...props}></Article>;
}
