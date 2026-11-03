import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { List, ListItem, OneOrManyItems } from "@repo/ui/lists";
import { useTranslation } from "#hooks";
import type { IOpenGraph, IOpenGraphMetaTag } from "#lib/seo";

interface IProps {
  openGraph: IOpenGraph;
}

interface IMetaTagProps {
  tag: IOpenGraphMetaTag;
}

export function OpenGraphView({ openGraph }: IProps) {
  const { t } = useTranslation();
  const {
    prefix,
    locale,
    alternateLocales,
    description,
    image,
    siteName,
    title,
    type,
    url,
    unknownTags,
  } = openGraph;

  return (
    <DescriptionList>
      {!prefix ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["opengraph-overview"].prefix)}
          dValue={prefix}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      {!locale ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["opengraph-overview"].locale)}
          dValue={locale}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      {!alternateLocales ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["opengraph-overview"]["alternate-locales"])}
          dValue={
            <Details
              summary={<Preformatted>{alternateLocales.length}</Preformatted>}
            >
              <List isOrdered>
                {alternateLocales.map((locale, index) => (
                  <ListItem key={index}>
                    <Preformatted>{locale}</Preformatted>
                  </ListItem>
                ))}
              </List>
            </Details>
          }
          isKeyPreformatted
        />
      )}

      {!url ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["opengraph-overview"].url)}
          dValue={url}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      {!type ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["opengraph-overview"].type)}
          dValue={type}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      {!siteName ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["opengraph-overview"]["site-name"])}
          dValue={siteName}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      {!title ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["opengraph-overview"].title)}
          dValue={title}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      {!description ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["opengraph-overview"].description)}
          dValue={description}
          isKeyPreformatted
          isValuePreformatted
        />
      )}

      <ImageSection image={image} />

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

interface ImageDataProps {
  image: IOpenGraph["image"];
}

function ImageSection({ image }: ImageDataProps) {
  const { t } = useTranslation();
  return !image ? undefined : (
    <DescriptionSection
      dKey={t((t) => t.seo["opengraph-overview"].image)}
      dValue={
        <Details summary={<Preformatted>{image.url}</Preformatted>}>
          <DescriptionList>
            {
              <DescriptionSection
                dKey={t(
                  (t) => t["seo"]["opengraph-overview"]["image-overview"].type,
                )}
                dValue={image.type}
                isKeyPreformatted
                isValuePreformatted
              />
            }
            {
              <DescriptionSection
                dKey={t(
                  (t) => t["seo"]["opengraph-overview"]["image-overview"].width,
                )}
                dValue={image.width}
                isKeyPreformatted
                isValuePreformatted
              />
            }
            {
              <DescriptionSection
                dKey={t(
                  (t) =>
                    t["seo"]["opengraph-overview"]["image-overview"].height,
                )}
                dValue={image.height}
                isKeyPreformatted
                isValuePreformatted
              />
            }
            {
              <DescriptionSection
                dKey={t(
                  (t) => t["seo"]["opengraph-overview"]["image-overview"].alt,
                )}
                dValue={image.alt}
                isKeyPreformatted
                isValuePreformatted
              />
            }
          </DescriptionList>
        </Details>
      }
      isKeyPreformatted
    />
  );
}

function MetaTag({ tag }: IMetaTagProps) {
  const { t } = useTranslation();
  const { name, property, content, unknownAttributes } = tag;

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t((t) => t.seo["opengraph-overview"]["meta-tag-overview"].name)}
        dValue={name}
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) => t.seo["opengraph-overview"]["meta-tag-overview"].property,
        )}
        dValue={property}
        isKeyPreformatted
        isValuePreformatted
      />

      <DescriptionSection
        dKey={t(
          (t) => t.seo["opengraph-overview"]["meta-tag-overview"].content,
        )}
        dValue={content}
        isKeyPreformatted
        isValuePreformatted
      />

      {!unknownAttributes ? undefined : (
        <DescriptionSection
          dKey={t(
            (t) =>
              t.seo["opengraph-overview"]["meta-tag-overview"][
                "unknown-attributes"
              ],
          )}
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
