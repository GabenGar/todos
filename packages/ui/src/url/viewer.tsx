import type { ITranslatableProps } from "#meta";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "#description-list";
import { Preformatted } from "#formatting";
import { Heading, type IHeadingLevel } from "#headings";
import { List, ListItem } from "#lists";
import { Details } from "#details";
import { Origin } from "./origin";
import { Pathname } from "./pathname";

import styles from "./viewer.module.scss";

export interface IURLViewerProps extends ITranslatableProps<ITranslationKey> {
  url: URL;
  headingLevel: IHeadingLevel;
}

type ITranslationKey =
  | "URLs"
  | "Full URL"
  | "Decoded URL"
  | "Origin Details"
  | "Origin"
  | "Protocol"
  | "Username"
  | "Password"
  | "Host"
  | "Hostname"
  | "Port"
  | "Pathname Details"
  | "Pathname"
  | "Search Parameters Details"
  | "Search"
  | "Search parameters"
  | "Fragment Details"
  | "Hash";

interface ITransformedSearchParams extends Map<string, string | Set<string>> {}

export function URLViewer({ t, headingLevel, url }: IURLViewerProps) {
  const { href, origin, pathname, search, searchParams, hash } = url;
  const transformedSearchParams = transformSearchparams(searchParams);
  const transformedURL = transformURL(url);
  const decodedURL = decodeURIComponent(String(transformedURL));

  return (
    <>
      <Heading level={headingLevel}>{t("URLs")}</Heading>
      <DescriptionList>
        <DescriptionSection
          dKey={t("Full URL")}
          dValue={<Preformatted>{href}</Preformatted>}
        />
        {href !== decodedURL && (
          <DescriptionSection
            dKey={t("Decoded URL")}
            dValue={<Preformatted>{decodedURL}</Preformatted>}
          />
        )}
      </DescriptionList>

      {origin && (
        <Details
          summary={
            <Heading level={headingLevel}>{t("Origin Details")}</Heading>
          }
        >
          <Origin t={t} url={url} />
        </Details>
      )}

      <Details
        summary={<Heading level={headingLevel}>{t("Pathname Details")}</Heading>}
      >
        <Pathname t={t} pathname={pathname} />
      </Details>

      {transformedSearchParams.size !== 0  && (
        <>
          <Heading level={headingLevel}>
            {t("Search Parameters Details")}
          </Heading>

          <DescriptionList>
            <DescriptionSection
              dKey={t("Search")}
              dValue={<Preformatted>{search}</Preformatted>}
            />

            <DescriptionSection
              dKey={t("Search parameters")}
              dValue={
                <TransformedSearchParams params={transformedSearchParams} />
              }
            />
          </DescriptionList>
        </>
      )}

      {hash.length === 0 ? undefined : (
        <>
          <Heading level={headingLevel}>{t("Fragment Details")}</Heading>
          <DescriptionList>
            <DescriptionSection
              dKey={t("Hash")}
              dValue={<Preformatted>{hash}</Preformatted>}
            />
          </DescriptionList>
        </>
      )}
    </>
  );
}

interface ITransformedSearchParamsProps {
  params: ITransformedSearchParams;
}

function TransformedSearchParams({ params }: ITransformedSearchParamsProps) {
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

function transformURL(url: URL) {
  const newURL = new URL(url);

  newURL.searchParams.sort();

  return newURL;
}

function transformSearchparams(
  searchParams: URLSearchParams
): ITransformedSearchParams {
  const sortedParams = new URLSearchParams(searchParams);
  const transformedSearchParams: ITransformedSearchParams = new Map();

  sortedParams.sort();

  for (const key of sortedParams.keys()) {
    const values = sortedParams.getAll(key);
    const value = values.length === 1 ? values[0] : new Set(values);
    // @ts-ignore
    transformedSearchParams.set(key, value);
  }

  return transformedSearchParams;
}
