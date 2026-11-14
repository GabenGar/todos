import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { OneOrManyItems } from "@repo/ui/lists";
import { useTranslation } from "#hooks";
import type { IVideoObjectJSONLD } from "#lib/seo/json-ld/types";

interface IProps {
  jsonLD: IVideoObjectJSONLD;
}

export function VideoObjectJSONLD( { jsonLD }: IProps ) {
  const { t } = useTranslation();
  const {
    actor: actors,
    contentUrl,
    description,
    duration,
    isFamilyFriendly,
    name,
    thumbnailUrl,
    uploadDate,
    url,
  } = jsonLD;

  return (
    <>
      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "video-object" ]
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
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "video-object" ]
              .name,
        ) }
        dValue={ name }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "video-object" ]
              .duration,
        ) }
        dValue={ duration }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "video-object" ][
              "thumbnail-url"
            ],
        ) }
        dValue={ thumbnailUrl }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "video-object" ]
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
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "video-object" ][
              "upload-date"
            ],
        ) }
        dValue={ uploadDate }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "video-object" ][
              "is-family-friendly"
            ],
        ) }
        dValue={ isFamilyFriendly }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={ t(
          ( t ) =>
            t.seo[ "json-ld-overview" ][ "type-overview" ][ "video-object" ][
              "content-url"
            ],
        ) }
        dValue={ contentUrl }
        isOptional
        isKeyPreformatted
        isValuePreformatted
      />

      { ! actors ? undefined : (
        <DescriptionSection
          dKey={ t(
            ( t ) =>
              t.seo[ "json-ld-overview" ][ "type-overview" ][ "video-object" ]
                .actors,
          ) }
          dValue={
            <Details summary={ actors.length }>
              <OneOrManyItems
                item={ actors }
                itemElement={ ( { "@type": type, name } ) => (
                  <DescriptionList isNested>
                    <DescriptionSection
                      dKey={ t(
                        ( t ) =>
                          t.seo[ "json-ld-overview" ][ "type-overview" ][
                            "video-object"
                          ][ "actor-type" ],
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
                            "video-object"
                          ][ "actor-name" ],
                      ) }
                      dValue={ name }
                      isOptional
                      isKeyPreformatted
                      isValuePreformatted
                    />
                  </DescriptionList>
                ) }
              />
            </Details>
          }
          isKeyPreformatted
        />
      ) }
    </>
  );
}
