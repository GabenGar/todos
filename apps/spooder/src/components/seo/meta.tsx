import { Preformatted } from "@repo/ui/formatting";
import { List, ListItem } from "@repo/ui/lists";
import type { IOneOrMany } from "@repo/ui/types";
import type { IMetaTag } from "#lib/seo";

interface IProps {
  metaTag: IOneOrMany<IMetaTag>;
}

export function MetaTagView({ metaTag }: IProps) {
  return !Array.isArray(metaTag) ? (
    <Preformatted>{metaTag.content}</Preformatted>
  ) : (
    <List>
      {metaTag.map((metaTag, index) => (
        <ListItem key={index}>
          <Preformatted>{metaTag.content}</Preformatted>
        </ListItem>
      ))}
    </List>
  );
}
