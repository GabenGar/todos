import { DescriptionSection } from "@repo/ui/description-list";
import { useTranslation } from "#hooks";
import type { IArticleJSONLD } from "#lib/seo/json-ld/types";

interface IProps {
  jsonLD: IArticleJSONLD;
}

export function ArticleJSONLD({ jsonLD }: IProps) {
  const { t } = useTranslation();
  const {
    mainEntity,
    author,
    dateModified,
    datePublished,
    headline,
    image,
    name,
    publisher,
    sameAs,
    url,
  } = jsonLD;

  return (
    <>
      <DescriptionSection />
      <DescriptionSection />
    </>
  );
}
