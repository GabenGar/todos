import { DateTimeView } from "@repo/ui/dates";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { EntityID } from "@repo/ui/entities";
import { Heading } from "@repo/ui/headings";
import {
  type IPreviewProps,
  Preview,
  PreviewBody,
  PreviewHeader,
} from "@repo/ui/previews";
import { useTranslation } from "#hooks";
import type { IBlogPostPreview } from "./types";

interface IProps extends IPreviewProps {
  post: IBlogPostPreview;
}

export function BlogPostPreview({ post, ...props }: IProps) {
  const { t } = useTranslation();
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
            </DescriptionList>
          </PreviewBody>
        </>
      )}
    </Preview>
  );
}
