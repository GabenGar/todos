import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { List, ListItem } from "@repo/ui/lists";
import { useTranslation } from "#hooks";
import type { ISEO } from "#lib/seo";
import { MetaTagView } from "./meta-tag";
//

import styles from "./seo.module.scss";

interface ISEOViewProps {
  seo: ISEO;
}

export function SEOView({ seo }: ISEOViewProps) {
  const { t } = useTranslation();
  const { title, description, metaTags } = seo;

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t((t) => t.seo.title)}
        dValue={
          !title ? undefined : !Array.isArray(title) ? (
            <Preformatted>{title}</Preformatted>
          ) : (
            <List>
              {title.map((title, index) => (
                <ListItem key={index}>
                  <Preformatted>{title}</Preformatted>
                </ListItem>
              ))}
            </List>
          )
        }
        isKeyPreformatted
      />
      <DescriptionSection
        dKey={t((t) => t.seo.description)}
        dValue={
          !description ? undefined : !Array.isArray(description) ? (
            <Preformatted>{description}</Preformatted>
          ) : (
            <List>
              {description.map((description, index) => (
                <ListItem key={index}>
                  <Preformatted>{description}</Preformatted>
                </ListItem>
              ))}
            </List>
          )
        }
        isKeyPreformatted
      />
      <DescriptionSection
        dKey={t((t) => t.seo["meta-elements"])}
        dValue={
          <Details summary={metaTags.length}>
            <List className={styles.list} isOrdered>
              {metaTags.map((metaTag, index) => (
                <ListItem key={index}>
                  <MetaTagView metaTag={metaTag} />
                </ListItem>
              ))}
            </List>
          </Details>
        }
        isKeyPreformatted
      />
    </DescriptionList>
  );
}
