import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { OneOrManyItems } from "@repo/ui/lists";
import type { IElementType } from "@repo/ui/types";
import { useTranslation } from "#hooks";
import type { IWebPageJSONLD } from "#lib/seo/json-ld/types";

interface IProps {
  jsonLD: IWebPageJSONLD;
}

export function WebPageJSONLD({ jsonLD }: IProps) {
  const { t } = useTranslation();
  const { mainEntity, url: pageURL } = jsonLD;

  if (!mainEntity) {
    return (
      <DescriptionSection
        dKey={t(
          (t) => t.seo["json-ld-overview"]["type-overview"]["web-page"].url,
        )}
        dValue={pageURL}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />
    );
  }

  const {
    "@type": type,
    author,
    comment: comments,
    commentCount,
    datePublished,
    identifier,
    image: images,
    interactionStatistic,
    text: body,
    thumbnailUrl,
    url,
  } = mainEntity;

  return (
    <>
      <DescriptionSection
        dKey={t(
          (t) => t.seo["json-ld-overview"]["type-overview"]["web-page"].url,
        )}
        dValue={pageURL}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ].type,
        )}
        dValue={type}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ].identifier,
        )}
        dValue={identifier}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ].body,
        )}
        dValue={body}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ]["thumbnail-url"],
        )}
        dValue={thumbnailUrl}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      {!images ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) =>
              t.seo["json-ld-overview"]["type-overview"]["web-page"][
                "main-entity-overview"
              ].images,
          )}
          dValue={
            <OneOrManyItems
              item={images}
              itemElement={(image) => <Preformatted>{image}</Preformatted>}
            />
          }
          isKeyPreformatted
        />
      )}

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ]["date-published"],
        )}
        dValue={datePublished}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      {!author ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) =>
              t.seo["json-ld-overview"]["type-overview"]["web-page"][
                "main-entity-overview"
              ]["author"],
          )}
          dValue={
            <Details summary={<Preformatted>{author.name}</Preformatted>}>
              <DescriptionList>
                <DescriptionSection
                  dKey={t(
                    (t) =>
                      t.seo["json-ld-overview"]["type-overview"]["web-page"][
                        "main-entity-overview"
                      ]["author-type"],
                  )}
                  dValue={author["@type"]}
                  isOptional
                  isKeyPreformatted
                  isValuePreformatted
                />

                <DescriptionSection
                  dKey={t(
                    (t) =>
                      t.seo["json-ld-overview"]["type-overview"]["web-page"][
                        "main-entity-overview"
                      ]["author-alternate-name"],
                  )}
                  dValue={author.alternateName}
                  isOptional
                  isKeyPreformatted
                  isValuePreformatted
                />

                <DescriptionSection
                  dKey={t(
                    (t) =>
                      t.seo["json-ld-overview"]["type-overview"]["web-page"][
                        "main-entity-overview"
                      ]["author-identifier"],
                  )}
                  dValue={author.identifier}
                  isOptional
                  isKeyPreformatted
                  isValuePreformatted
                />

                <DescriptionSection
                  dKey={t(
                    (t) =>
                      t.seo["json-ld-overview"]["type-overview"]["web-page"][
                        "main-entity-overview"
                      ]["author-url"],
                  )}
                  dValue={author.url}
                  isOptional
                  isKeyPreformatted
                  isValuePreformatted
                />
              </DescriptionList>
            </Details>
          }
          isKeyPreformatted
        />
      )}

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ].url,
        )}
        dValue={url}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      {!interactionStatistic ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) =>
              t.seo["json-ld-overview"]["type-overview"]["web-page"][
                "main-entity-overview"
              ]["interaction-statistic"],
          )}
          dValue={
            <Details
              summary={
                <Preformatted>{interactionStatistic.length}</Preformatted>
              }
            >
              <OneOrManyItems
                item={interactionStatistic}
                itemElement={({
                  "@type": type,
                  interactionType,
                  userInteractionCount,
                }) => {
                  return (
                    <DescriptionList isNested>
                      <DescriptionSection
                        dKey={t(
                          (t) =>
                            t.seo["json-ld-overview"]["type-overview"][
                              "web-page"
                            ]["main-entity-overview"][
                              "interaction-statistic-type"
                            ],
                        )}
                        dValue={type}
                        isOptional
                        isKeyPreformatted
                        isValuePreformatted
                      />

                      <DescriptionSection
                        dKey={t(
                          (t) =>
                            t.seo["json-ld-overview"]["type-overview"][
                              "web-page"
                            ]["main-entity-overview"][
                              "interaction-statistic-interaction-type"
                            ],
                        )}
                        dValue={interactionType}
                        isOptional
                        isKeyPreformatted
                        isValuePreformatted
                      />

                      <DescriptionSection
                        dKey={t(
                          (t) =>
                            t.seo["json-ld-overview"]["type-overview"][
                              "web-page"
                            ]["main-entity-overview"][
                              "interaction-statistic-user-interaction-count"
                            ],
                        )}
                        dValue={userInteractionCount}
                        isOptional
                        isKeyPreformatted
                        isValuePreformatted
                      />
                    </DescriptionList>
                  );
                }}
              />
            </Details>
          }
          isKeyPreformatted
        />
      )}

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ]["comment-count"],
        )}
        dValue={commentCount}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      {!comments ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) =>
              t.seo["json-ld-overview"]["type-overview"]["web-page"][
                "main-entity-overview"
              ]["comments"],
          )}
          dValue={
            <Details summary={<Preformatted>{comments.length}</Preformatted>}>
              <OneOrManyItems
                item={comments}
                itemElement={(comment) => <Comment comment={comment} />}
              />
            </Details>
          }
          isKeyPreformatted
        />
      )}
    </>
  );
}

interface ICommentProps {
  comment: IElementType<Required<IWebPageJSONLD["mainEntity"]>["comment"]>;
}

function Comment({ comment }: ICommentProps) {
  const { t } = useTranslation();

  const {
    "@type": type,
    datePublished,
    identifier,
    text: body,
    url,
    author,
  } = comment;

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ]["comment-overview"].type,
        )}
        dValue={type}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ]["comment-overview"].identifier,
        )}
        dValue={identifier}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ]["comment-overview"].body,
        )}
        dValue={body}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ]["comment-overview"]["date-published"],
        )}
        dValue={datePublished}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      {!author ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) =>
              t.seo["json-ld-overview"]["type-overview"]["web-page"][
                "main-entity-overview"
              ]["comment-overview"].author,
          )}
          dValue={
            <Details summary={<Preformatted>{author.name}</Preformatted>}>
              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"]["web-page"][
                      "main-entity-overview"
                    ]["comment-overview"]["author-overview"].type,
                )}
                dValue={author["@type"]}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />

              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"]["web-page"][
                      "main-entity-overview"
                    ]["comment-overview"]["author-overview"].identifier,
                )}
                dValue={author.identifier}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />

              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"]["web-page"][
                      "main-entity-overview"
                    ]["comment-overview"]["author-overview"]["alternate-name"],
                )}
                dValue={author.alternateName}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />

              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"]["web-page"][
                      "main-entity-overview"
                    ]["comment-overview"]["author-overview"]["thumbnail-url"],
                )}
                dValue={author.thumbnailUrl}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />

              {!author.image ? undefined : (
                <DescriptionSection
                  dKey={t(
                    (t) =>
                      t.seo["json-ld-overview"]["type-overview"]["web-page"][
                        "main-entity-overview"
                      ]["comment-overview"]["author-overview"]["images"],
                  )}
                  dValue={
                    <OneOrManyItems
                      item={author.image}
                      itemElement={(image) => (
                        <Preformatted>{image}</Preformatted>
                      )}
                    />
                  }
                  isOptional
                  isKeyPreformatted
                  isValuePreformatted
                />
              )}

              <DescriptionSection
                dKey={t(
                  (t) =>
                    t.seo["json-ld-overview"]["type-overview"]["web-page"][
                      "main-entity-overview"
                    ]["comment-overview"]["author-overview"]["url"],
                )}
                dValue={author.url}
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />
            </Details>
          }
          isKeyPreformatted
        />
      )}

      <DescriptionSection
        dKey={t(
          (t) =>
            t.seo["json-ld-overview"]["type-overview"]["web-page"][
              "main-entity-overview"
            ]["comment-overview"].url,
        )}
        dValue={url}
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />
    </DescriptionList>
  );
}
