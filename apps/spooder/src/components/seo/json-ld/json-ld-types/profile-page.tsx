import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { OneOrManyItems } from "@repo/ui/lists";
import { useTranslation } from "#hooks";
import type { IProfilePageJSONLD } from "#lib/seo/json-ld/types";

interface IProps {
  jsonLD: IProfilePageJSONLD;
}

export function ProfilePageJSONLD( { jsonLD }: IProps ) {
  const { t } = useTranslation();
  const { mainEntity, contentRating, dateCreated } = jsonLD;

  if ( ! mainEntity ) {
    return (
      <>
        <DescriptionSection
          dKey={ t(
            ( t ) =>
              t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ][
                "content-rating"
              ],
          ) }
          dValue={ contentRating }
          isOptional
          isKeyPreformatted
          isValuePreformatted
        />
        <DescriptionSection
          dKey={ t(
            ( t ) =>
              t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ][
                "created-at"
              ],
          ) }
          dValue={ dateCreated }
          isOptional
          isKeyPreformatted
          isValuePreformatted
        />
      </>
    );
  }

  const {
    alternateName,
    additionalName,
    agentInteractionStatistic,
    description,
    homeLocation,
    identifier,
    image,
    interactionStatistic,
    name,
    url,
  } = mainEntity;

  return (
    <>
      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ].id,
        ) }
        dValue={ identifier }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ]
              .name,
        ) }
        dValue={ name }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      { ! image ? undefined : (
        <DescriptionSection
          dKey={ t(
            ( t ) =>
              t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ]
                .image,
          ) }
          dValue={
            typeof image === "string" ? (
              <Preformatted>{ image }</Preformatted>
            ) : (
              <DescriptionList isNested>
                <DescriptionSection
                  dKey={ t(
                    ( t ) =>
                      t.seo[ "json-ld-overview" ][ "type-overview" ][
                        "profile-page"
                      ][ "image-type" ],
                  ) }
                  dValue={ image[ "@type" ] }
                  isOptional
                  isKeyPreformatted
                  isValuePreformatted
                />

                <DescriptionSection
                  dKey={ t(
                    ( t ) =>
                      t.seo[ "json-ld-overview" ][ "type-overview" ][
                        "profile-page"
                      ][ "image-content-url" ],
                  ) }
                  dValue={ image.contentUrl }
                  isOptional
                  isKeyPreformatted
                  isValuePreformatted
                />

                <DescriptionSection
                  dKey={ t(
                    ( t ) =>
                      t.seo[ "json-ld-overview" ][ "type-overview" ][
                        "profile-page"
                      ][ "image-thumbnail-url" ],
                  ) }
                  dValue={ image.thumbnailUrl }
                  isOptional
                  isKeyPreformatted
                  isValuePreformatted
                />
              </DescriptionList>
            )
          }
          isKeyPreformatted
        />
      ) }

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ][
              "content-rating"
            ],
        ) }
        dValue={ contentRating }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ][
              "additional-name"
            ],
        ) }
        dValue={ additionalName }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ][
              "alternate-name"
            ],
        ) }
        dValue={ alternateName }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ]
              .description,
        ) }
        dValue={ description }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ]
              .url,
        ) }
        dValue={ url }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ][
              "created-at"
            ],
        ) }
        dValue={ dateCreated }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      { ! homeLocation ? undefined : (
        <DescriptionSection
          dKey={ t(
            ( t ) =>
              t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ][
                "home-location"
              ],
          ) }
          dValue={
            <DescriptionList isNested>
              <DescriptionSection
                dKey={ t(
                  ( t ) =>
                    t.seo[ "json-ld-overview" ][ "type-overview" ][
                      "profile-page"
                    ][ "home-location-type" ],
                ) }
                dValue={ homeLocation[ "@type" ] }
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />

              <DescriptionSection
                dKey={ t(
                  ( t ) =>
                    t.seo[ "json-ld-overview" ][ "type-overview" ][
                      "profile-page"
                    ][ "home-location-name" ],
                ) }
                dValue={ homeLocation.name }
                isOptional
                isKeyPreformatted
                isValuePreformatted
              />
            </DescriptionList>
          }
          isKeyPreformatted
        />
      ) }

      { ! interactionStatistic ? undefined : (
        <DescriptionSection
          dKey={ t(
            ( t ) =>
              t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ][
                "interaction-statistic"
              ],
          ) }
          dValue={
            <OneOrManyItems
              item={ interactionStatistic }
              itemElement={ ( {
                "@type": type,
                interactionType,
                name,
                userInteractionCount,
              } ) => (
                <DescriptionList isNested>
                  <DescriptionSection
                    dKey={ t(
                      ( t ) =>
                        t.seo[ "json-ld-overview" ][ "type-overview" ][
                          "profile-page"
                        ][ "interaction-statistic-overview" ].type,
                    ) }
                    dValue={ type }
                    isOptional
                    isKeyPreformatted
                    isValuePreformatted
                  />
                  <DescriptionSection
                    dKey={ t(
                      ( t ) =>
                        t.seo[ "json-ld-overview" ][ "type-overview" ][
                          "profile-page"
                        ][ "interaction-statistic-overview" ][
                          "interaction-type"
                        ],
                    ) }
                    dValue={ interactionType }
                    isOptional
                    isKeyPreformatted
                    isValuePreformatted
                  />
                  <DescriptionSection
                    dKey={ t(
                      ( t ) =>
                        t.seo[ "json-ld-overview" ][ "type-overview" ][
                          "profile-page"
                        ][ "interaction-statistic-overview" ].name,
                    ) }
                    dValue={ name }
                    isOptional
                    isKeyPreformatted
                    isValuePreformatted
                  />
                  <DescriptionSection
                    dKey={ t(
                      ( t ) =>
                        t.seo[ "json-ld-overview" ][ "type-overview" ][
                          "profile-page"
                        ][ "interaction-statistic-overview" ][
                          "user-interaction-count"
                        ],
                    ) }
                    dValue={ userInteractionCount }
                    isOptional
                    isKeyPreformatted
                    isValuePreformatted
                  />
                </DescriptionList>
              ) }
            />
          }
          isKeyPreformatted
        />
      ) }

      { ! agentInteractionStatistic ? undefined : (
        <DescriptionSection
          dKey={ t(
            ( t ) =>
              t.seo[ "json-ld-overview" ][ "type-overview" ][ "profile-page" ][
                "agent-interaction-statistic"
              ],
          ) }
          dValue={
            <OneOrManyItems
              item={ agentInteractionStatistic }
              itemElement={ ( {
                "@type": type,
                interactionType,
                userInteractionCount,
              } ) => (
                <DescriptionList isNested>
                  <DescriptionSection
                    dKey={ t(
                      ( t ) =>
                        t.seo[ "json-ld-overview" ][ "type-overview" ][
                          "profile-page"
                        ][ "interaction-statistic-overview" ].type,
                    ) }
                    dValue={ type }
                    isOptional
                    isKeyPreformatted
                    isValuePreformatted
                  />
                  <DescriptionSection
                    dKey={ t(
                      ( t ) =>
                        t.seo[ "json-ld-overview" ][ "type-overview" ][
                          "profile-page"
                        ][ "interaction-statistic-overview" ][
                          "interaction-type"
                        ],
                    ) }
                    dValue={ interactionType }
                    isOptional
                    isKeyPreformatted
                    isValuePreformatted
                  />
                  <DescriptionSection
                    dKey={ t(
                      ( t ) =>
                        t.seo[ "json-ld-overview" ][ "type-overview" ][
                          "profile-page"
                        ][ "interaction-statistic-overview" ][
                          "user-interaction-count"
                        ],
                    ) }
                    dValue={ userInteractionCount }
                    isOptional
                    isKeyPreformatted
                    isValuePreformatted
                  />
                </DescriptionList>
              ) }
            />
          }
          isKeyPreformatted
        />
      ) }
    </>
  );
}
