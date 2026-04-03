import { DateTimeView } from "@repo/ui/dates";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { EntityID } from "@repo/ui/entities";
import { Heading } from "@repo/ui/headings";
import {
  type IPreviewProps,
  Preview,
  PreviewBody,
  PreviewFooter,
  PreviewHeader,
} from "@repo/ui/previews";
import { LinkInternal } from "#components/links";
import { useTranslation } from "#hooks";
import type { IBlogPostPreview } from "./types";

interface IProps extends IPreviewProps {
  post: IBlogPostPreview;
}

export function BlogPostPreview({ post, ...props }: IProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const { id, title, description, created_at, edited_at, published_at } = post;

  return (
    <Preview {...props}>
      {(level) => (
        <>
          <PreviewHeader>
            <Heading level={level}>{title}</Heading>
            <EntityID entityID={id} />
          </PreviewHeader>

          <PreviewBody>
            <DescriptionList>
              <DescriptionSection
                dKey={t((t) => t.entities["blog-post"].description)}
                dValue={description}
                isKeyPreformatted
                isValuePreformatted
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
          </PreviewBody>

          <PreviewFooter>
            <LinkInternal
              to={"/$language/blog/post/$post_id"}
              params={{ language, post_id: id }}
            >
              {t((t) => t.entities["blog-post"]["read-more"])}
            </LinkInternal>
          </PreviewFooter>
        </>
      )}
    </Preview>
  );
}
