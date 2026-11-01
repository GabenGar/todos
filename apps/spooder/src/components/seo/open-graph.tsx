import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { List, ListItem } from "@repo/ui/lists";
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
  const { unknownTags } = openGraph;

  return (
    <DescriptionList>
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
                          !Array.isArray(value) ? (
                            <Preformatted>{value}</Preformatted>
                          ) : (
                            <List>
                              {value.map((value, index) => (
                                <ListItem key={index}>
                                  <Preformatted>{value}</Preformatted>
                                </ListItem>
                              ))}
                            </List>
                          )
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
