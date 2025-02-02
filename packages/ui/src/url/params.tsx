import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "#description-list";
import { Preformatted } from "#formatting";

import { List, ListItem } from "#lists";

import styles from "./params.module.scss";

interface ITransformedSearchParamsProps {
  params: ITransformedSearchParams;
}

export interface ITransformedSearchParams extends Map<string, string | Set<string>> {}

export function TransformedSearchParams({
  params,
}: ITransformedSearchParamsProps) {
  return (
    <DescriptionList>
      {Array.from(params).map(([key, value]) => (
        <DescriptionSection key={key}>
          <DescriptionTerm>
            <Preformatted>{key}:</Preformatted>
          </DescriptionTerm>

          <DescriptionDetails className={styles.params}>
            {typeof value === "string" ? (
              <Preformatted>{value}</Preformatted>
            ) : (
              <List isOrdered>
                {Array.from(value).map((value, index) => (
                  <ListItem
                    key={`${value}-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: no explanation
                      index
                    }`}
                  >
                    <Preformatted>{value}</Preformatted>
                  </ListItem>
                ))}
              </List>
            )}
          </DescriptionDetails>
        </DescriptionSection>
      ))}
    </DescriptionList>
  );
}
