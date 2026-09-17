import {
  type IOverviewProps,
  Overview,
  OverviewBody,
  OverviewHeader,
} from "@repo/ui/articles";
import { DateTimeView } from "@repo/ui/dates";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { EntityID } from "@repo/ui/entities";
import { Heading } from "@repo/ui/headings";
import { MarkdownView } from "#components/markdown";
import { useTranslation } from "#hooks";
import type { IBlogPostOverview } from "./types";

interface IProps extends IOverviewProps {
  post: IBlogPostOverview;
}

export function BlogPostOverview({ post, ...props }: IProps) {
  const { t } = useTranslation();
  const {
    content,
    id,
    title,
    description,
    created_at,
    edited_at,
    published_at,
  } = post;

  return (
    <Overview {...props}>
      {(headingLevel) => (
        <>
          <OverviewHeader>
            <Heading level={headingLevel}>{title}</Heading>
            <p>{description}</p>
            <DescriptionList>
              <DescriptionSection
                dKey={t((t) => t.entities["blog-post"].id)}
                dValue={<EntityID entityID={id} />}
                isKeyPreformatted
              />
              <DescriptionSection
                dKey={t((t) => t.entities["blog-post"]["created-at"])}
                dValue={<DateTimeView dateTime={created_at} />}
                isKeyPreformatted
              />

              {!published_at ? (
                <DescriptionSection
                  dKey={t((t) => t.entities["blog-post"]["published-at"])}
                  isKeyPreformatted
                />
              ) : (
                <DescriptionSection
                  dKey={t((t) => t.entities["blog-post"]["published-at"])}
                  dValue={<DateTimeView dateTime={published_at} />}
                  isKeyPreformatted
                />
              )}

              {!edited_at ? (
                <DescriptionSection
                  dKey={t((t) => t.entities["blog-post"]["edited-at"])}
                  isKeyPreformatted
                />
              ) : (
                <DescriptionSection
                  dKey={t((t) => t.entities["blog-post"]["edited-at"])}
                  dValue={<DateTimeView dateTime={edited_at} />}
                  isKeyPreformatted
                />
              )}
            </DescriptionList>
          </OverviewHeader>

          <OverviewBody>
            <MarkdownView>{content}</MarkdownView>
          </OverviewBody>
        </>
      )}
    </Overview>
  );
}
