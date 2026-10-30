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
  const {
    charSet,
    title,
    description,
    applicationName,
    unknownMetaTags,
    author,
    colorScheme,
    creator,
    generator,
    googlebot,
    keywords,
    publisher,
    referrer,
    responsiveEmbeddedSizing,
    robots,
    textScale,
    themeColor,
    viewport,
    invalidMetaTags,
  } = seo;

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t((t) => t.seo.charset)}
        dValue={
          !charSet ? undefined : !Array.isArray(charSet) ? (
            <Preformatted>{charSet}</Preformatted>
          ) : (
            <List>
              {charSet.map((charSet, index) => (
                <ListItem key={index}>
                  <Preformatted>{charSet}</Preformatted>
                </ListItem>
              ))}
            </List>
          )
        }
        isKeyPreformatted
      />

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
          dValue={<MetaTagView metaTag={description} />}
          isKeyPreformatted
        />
      )}

      {!applicationName ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["application-name"])}
          dValue={<MetaTagView metaTag={applicationName} />}
          isKeyPreformatted
        />
      )}

      {!author ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["author"])}
          dValue={<MetaTagView metaTag={author} />}
          isKeyPreformatted
        />
      )}

      {!creator ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["creator"])}
          dValue={<MetaTagView metaTag={creator} />}
          isKeyPreformatted
        />
      )}

      {!publisher ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["publisher"])}
          dValue={<MetaTagView metaTag={publisher} />}
          isKeyPreformatted
        />
      )}

      {!generator ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["generator"])}
          dValue={<MetaTagView metaTag={generator} />}
          isKeyPreformatted
        />
      )}

      {!keywords ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["keywords"])}
          dValue={<MetaTagView metaTag={keywords} />}
          isKeyPreformatted
        />
      )}

      {!robots ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["robots"])}
          dValue={<MetaTagView metaTag={robots} />}
          isKeyPreformatted
        />
      )}

      {!googlebot ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["googlebot"])}
          dValue={<MetaTagView metaTag={googlebot} />}
          isKeyPreformatted
        />
      )}

      {!themeColor ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["theme-color"])}
          dValue={<MetaTagView metaTag={themeColor} />}
          isKeyPreformatted
        />
      )}

      {!colorScheme ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["color-scheme"])}
          dValue={<MetaTagView metaTag={colorScheme} />}
          isKeyPreformatted
        />
      )}

      {!responsiveEmbeddedSizing ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["responsive-embedded-sizing"])}
          dValue={<MetaTagView metaTag={responsiveEmbeddedSizing} />}
          isKeyPreformatted
        />
      )}

      {!textScale ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["text-scale"])}
          dValue={<MetaTagView metaTag={textScale} />}
          isKeyPreformatted
        />
      )}

      {!viewport ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["viewport"])}
          dValue={<MetaTagView metaTag={viewport} />}
          isKeyPreformatted
        />
      )}

      {!referrer ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["referrer"])}
          dValue={<MetaTagView metaTag={referrer} />}
          isKeyPreformatted
        />
      )}

      {unknownMetaTags.length === 0 ? undefined : (
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
      )}

      {invalidMetaTags.length === 0 ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.seo["invalid-meta-elements"])}
          dValue={
            <Details summary={invalidMetaTags.length}>
              <List className={styles.list} isOrdered>
                {invalidMetaTags.map((metaTag, index) => (
                  <ListItem key={index}>
                    <UnknownMetaTagView metaTag={metaTag} />
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
