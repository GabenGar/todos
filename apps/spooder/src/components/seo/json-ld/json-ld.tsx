import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Details } from "@repo/ui/details";
import { Preformatted } from "@repo/ui/formatting";
import { OneOrManyItems } from "@repo/ui/lists";
import { useTranslation } from "#hooks";
import type { IJSONLDMeta } from "#lib/seo/json-ld";
import { KnownJSONLDOverview } from "./known";

interface IProps {
  jsonLD: IJSONLDMeta;
}

export function JSONLDOverview( { jsonLD }: IProps ) {
  const { t } = useTranslation();
  const { items, unknownItems, invalidItems } = jsonLD;

  return (
    <DescriptionList>
      { ! items ? undefined : (
        <DescriptionSection
          dKey={ t( ( t ) => t.seo[ "json-ld-overview" ].items ) }
          dValue={
            <Details
              summary={
                <Preformatted>
                  { ! Array.isArray( items ) ? 1 : items.length }
                </Preformatted>
              }
            >
              <OneOrManyItems
                isOrdered
                item={ items }
                itemElement={ ( jsonLD ) => (
                  <KnownJSONLDOverview jsonLD={ jsonLD } />
                ) }
              />
            </Details>
          }
        />
      ) }

      { ! unknownItems ? undefined : (
        <DescriptionSection
          dKey={ t( ( t ) => t.seo[ "json-ld-overview" ][ "unknown-items" ] ) }
          dValue={
            <Details
              summary={
                <Preformatted>
                  { ! Array.isArray( unknownItems ) ? 1 : unknownItems.length }
                </Preformatted>
              }
            >
              <OneOrManyItems
                item={ unknownItems }
                itemElement={ ( jsonLD ) => (
                  <Preformatted>
                    { JSON.stringify( jsonLD, undefined, 2 ) }
                  </Preformatted>
                ) }
              />
            </Details>
          }
        />
      ) }

      { ! invalidItems ? undefined : (
        <DescriptionSection
          dKey={ t( ( t ) => t.seo[ "json-ld-overview" ][ "invalid-items" ] ) }
          dValue={
            <Details
              summary={
                <Preformatted>
                  { ! Array.isArray( invalidItems ) ? 1 : invalidItems.length }
                </Preformatted>
              }
            >
              <OneOrManyItems
                item={ invalidItems }
                itemElement={ ( jsonLD ) => (
                  <Preformatted>{ jsonLD }</Preformatted>
                ) }
              />
            </Details>
          }
        />
      ) }
    </DescriptionList>
  );
}
