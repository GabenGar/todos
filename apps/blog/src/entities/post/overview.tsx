import {
  type IOverviewProps,
  Overview,
  OverviewBody,
  OverviewHeader,
} from "@repo/ui/articles";
import { EntityID } from "@repo/ui/entities";
import { Heading } from "@repo/ui/headings";
import { MarkdownView } from "#components/markdown";
import type { IBlogPostOverview } from "./types";

interface IProps extends IOverviewProps {
  post: IBlogPostOverview;
}

export function BlogPostOverview({ post, ...props }: IProps) {
  const { content, id, title } = post;

  return (
    <Overview {...props}>
      {(headingLevel) => (
        <>
          <OverviewHeader>
            <Heading level={headingLevel}>{title}</Heading>
            <EntityID entityID={id} />
          </OverviewHeader>
          
          <OverviewBody>
            <MarkdownView>{content}</MarkdownView>
          </OverviewBody>
        </>
      )}
    </Overview>
  );
}
