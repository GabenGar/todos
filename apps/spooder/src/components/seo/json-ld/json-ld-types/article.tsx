import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
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
      <DescriptionSection
        dKey={t(
          (t) => t.seo["json-ld-overview"]["type-overview"].article.headline,
        )}
        dValue={headline}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t((t) => t.seo["json-ld-overview"]["type-overview"].article.name)}
        dValue={name}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) => t.seo["json-ld-overview"]["type-overview"].article.image,
        )}
        dValue={image}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"].article[
              "date-published"
            ],
        )}
        dValue={datePublished}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"].article["date-modified"],
        )}
        dValue={dateModified}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) => t.seo["json-ld-overview"]["type-overview"].article["url"],
        )}
        dValue={url}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      {!author ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) => t.seo["json-ld-overview"]["type-overview"].article["author"],
          )}
          dValue={
            <DescriptionList isNested>
              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"].article[
                      "author-type"
                    ],
                )}
                dValue={author["@type"]}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />
              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"].article[
                      "author-name"
                    ],
                )}
                dValue={author.name}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />
            </DescriptionList>
          }
          isKeyPreformatted
        />
      )}

      {!publisher ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) =>
              t.seo["json-ld-overview"]["type-overview"].article["publisher"],
          )}
          dValue={
            <DescriptionList isNested>
              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"].article[
                      "publisher-type"
                    ],
                )}
                dValue={publisher["@type"]}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />

              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"].article[
                      "publisher-name"
                    ],
                )}
                dValue={publisher.name}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />

              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"].article[
                      "publisher-logo"
                    ],
                )}
                dValue={publisher.logo?.url}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />
            </DescriptionList>
          }
          isKeyPreformatted
        />
      )}

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"].article["main-entity"],
        )}
        dValue={mainEntity}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) => t.seo["json-ld-overview"]["type-overview"].article["same-as"],
        )}
        dValue={sameAs}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />
    </>
  );
}
