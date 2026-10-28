import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { List, ListItem } from "@repo/ui/lists";
import { useTranslation } from "#hooks";
import type { ISEO } from "#lib/seo";
import { MetaTagView } from "./meta";
import { UnknownMetaTagView } from "./unknown-meta";
//

import styles from "./seo.module.scss";

interface ISEOViewProps {
  seo: ISEO;
}

export function SEOView({ seo }: ISEOViewProps) {
  const { t } = useTranslation();
  const { title, description, applicationName, unknownMetaTags } = seo;

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

      {!description ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo.description)}
          dValue={
            !Array.isArray(description) ? (
              <MetaTagView metaTag={description} />
            ) : (
              <List>
                {description.map((description, index) => (
                  <ListItem key={index}>
                    <MetaTagView metaTag={description} />
                  </ListItem>
                ))}
              </List>
            )
          }
          isKeyPreformatted
        />
      )}

      {!applicationName ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["application-name"])}
          dValue={
            !Array.isArray(applicationName) ? (
              <MetaTagView metaTag={applicationName} />
            ) : (
              <List>
                {applicationName.map((applicationName, index) => (
                  <ListItem key={index}>
                    <MetaTagView metaTag={applicationName} />
                  </ListItem>
                ))}
              </List>
            )
          }
          isKeyPreformatted
        />
      )}

      <DescriptionSection
        dKey={t((t) => t.seo["unknown-meta-elements"])}
        dValue={
          <Details summary={unknownMetaTags.length}>
            <List className={styles.list} isOrdered>
              {unknownMetaTags.map((metaTag, index) => (
                <ListItem key={index}>
                  <UnknownMetaTagView metaTag={metaTag} />
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
