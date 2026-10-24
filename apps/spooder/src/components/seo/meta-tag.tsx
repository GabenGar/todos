import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { List, ListItem } from "@repo/ui/lists";
import type { IMetaTag } from "#lib/seo";

interface IProps {
  metaTag: IMetaTag;
}

export function MetaTagView({ metaTag }: IProps) {
  return (
    <DescriptionList>
      {Array.from(metaTag.entries()).map(([key, valueOrValues]) => (
        <DescriptionSection
          key={key}
          dKey={key}
          dValue={
            !Array.isArray(valueOrValues) ? (
              <Preformatted>{valueOrValues}</Preformatted>
            ) : (
              <List isOrdered>
                {valueOrValues.map((value, index) => (
                  <ListItem key={`${value}-${index}`}>
                    <Preformatted>{value}</Preformatted>
                  </ListItem>
                ))}
              </List>
            )
          }
          isKeyPreformatted
        />
      ))}
    </DescriptionList>
  );
}
