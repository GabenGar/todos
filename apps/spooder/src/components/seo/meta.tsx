import { Preformatted } from "@repo/ui/formatting";
import type { IMetaTag } from "#lib/seo";

interface IProps {
  metaTag: IMetaTag;
}

export function MetaTagView({ metaTag }: IProps) {
  const { content } = metaTag;

  return <Preformatted>{content}</Preformatted>;
}
