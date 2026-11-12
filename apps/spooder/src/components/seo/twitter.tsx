import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { List, ListItem, OneOrManyItems } from "@repo/ui/lists";
import { useTranslation } from "#hooks";
import type { ITwitterMetaTag, ITwitterTags } from "#lib/seo";

interface IProps {
  twitter: ITwitterTags;
}

interface IMetaTagProps {
  tag: ITwitterMetaTag;
}

export function TwitterOverview({ twitter }: IProps) {
  const { t } = useTranslation();
  const { site, title, description, image, creator, card, unknownTags } =
    twitter;

  return (
    <DescriptionList>
      <SiteSection site={site} />

      {!title ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["twitter-overview"].title)}
          dValue={title}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      {!description ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["twitter-overview"].description)}
          dValue={description}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      <ImageSection image={image} />

      {!creator ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["twitter-overview"].creator)}
          dValue={creator}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      {!card ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["twitter-overview"].card)}
          dValue={card}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      {!unknownTags ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["opengraph-overview"]["unknown-tags"])}
          dValue={
            <Details
              summary={<Preformatted>{unknownTags.length}</Preformatted>}
            >
              <List isOrdered>
                {unknownTags.map((tag, index) => (
                  <MetaTag key={index} tag={tag} />
                ))}
              </List>
            </Details>
          }
          isKeyPreformatted
        />
      )}
    </DescriptionList>
  );
}

interface ISiteDataProps {
  site: ITwitterTags["site"];
}

function SiteSection({ site }: ISiteDataProps) {
  const { t } = useTranslation();
  return !site ? undefined : (
    <DescriptionSection
      dKey={t((t) => t.seo["twitter-overview"].site)}
      dValue={
        <Details summary={<Preformatted>{site.url}</Preformatted>}>
          <DescriptionList>
            <DescriptionSection
              dKey={t((t) => t["seo"]["twitter-overview"]["site-overview"].id)}
              dValue={site.id}
              isKeyPreformatted
              isValuePreformatted
            />
          </DescriptionList>
        </Details>
      }
      isKeyPreformatted
    />
  );
}
interface IImageDataProps {
  image: ITwitterTags["image"];
}

function ImageSection({ image }: IImageDataProps) {
  const { t } = useTranslation();
  return !image ? undefined : (
    <DescriptionSection
      dKey={t((t) => t.seo["twitter-overview"].image)}
      dValue={
        <Details summary={<Preformatted>{image.url}</Preformatted>}>
          <DescriptionList>
            <DescriptionSection
              dKey={t(
                (t) => t["seo"]["twitter-overview"]["image-overview"].alt,
              )}
              dValue={image.alt}
              isKeyPreformatted
              isValuePreformatted
            />
          </DescriptionList>
        </Details>
      }
      isKeyPreformatted
    />
  );
}

function MetaTag({ tag }: IMetaTagProps) {
  const { t } = useTranslation();
  const { name, content, unknownAttributes } = tag;

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t((t) => t.seo["meta-tag-overview"].name)}
        dValue={name}
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t((t) => t.seo["meta-tag-overview"].content)}
        dValue={content}
        isKeyPreformatted
        isValuePreformatted
      />

      {!unknownAttributes ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["meta-tag-overview"]["unknown-attributes"])}
          dValue={
            <Details
              summary={<Preformatted>{unknownAttributes.size}</Preformatted>}
            >
              <List>
                {Object.entries(unknownAttributes).map(([key, value]) => (
                  <ListItem key={key}>
                    <DescriptionList>
                      <DescriptionSection
                        dKey={key}
                        dValue={
                          <OneOrManyItems
                            item={value}
                            itemElement={(value) => (
                              <Preformatted>{value}</Preformatted>
                            )}
                          />
                        }
                        isKeyPreformatted
                      />
                    </DescriptionList>
                  </ListItem>
                ))}
              </List>
            </Details>
          }
          isKeyPreformatted
        />
      )}
    </DescriptionList>
  );
}
