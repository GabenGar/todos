import type { ITranslatableProps } from "#meta";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "#description-list";
import { Preformatted } from "#formatting";
import { Heading, type IHeadingLevel } from "#headings";
import { List } from "#lists";

import styles from "./viewer.module.scss";

interface IURLViewerProps extends ITranslatableProps<ITranslationKey> {
  url: URL;
  headingLevel: IHeadingLevel;
}

type ITranslationKey =
  | "URLs"
  | "Full URL"
  | "Transformed URL"
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
  const {
    href,
    origin,
    protocol,
    username,
    password,
    host,
    hostname,
    port,
    pathname,
    search,
    searchParams,
    hash,
  } = url;
  const explicitPort =
    port.length !== 0
      ? port
      : protocol === "http:"
        ? "80"
        : protocol === "https:"
          ? "443"
          : undefined;
  const transformedSearchParams = transformSearchparams(searchParams);
  const transformedURL = transformURL(url);

  return (
    <>
      <Heading level={headingLevel}>{t("URLs")}</Heading>
      <DescriptionList>
        <DescriptionSection
          dKey={t("Full URL")}
          dValue={<Preformatted>{href}</Preformatted>}
        />
        <DescriptionSection
          dKey={t("Transformed URL")}
          dValue={
            <Preformatted>
              {decodeURIComponent(String(transformedURL))}
            </Preformatted>
          }
        />
      </DescriptionList>

      <Heading level={headingLevel}>{t("Origin Details")}</Heading>

      <DescriptionList>
        <DescriptionSection
          dKey={t("Origin")}
          dValue={<Preformatted>{origin}</Preformatted>}
        />

        <DescriptionSection
          dKey={t("Protocol")}
          dValue={<Preformatted>{protocol}</Preformatted>}
        />

        {username.length === 0 ? undefined : (
          <DescriptionSection
            dKey={t("Username")}
            dValue={<Preformatted>{username}</Preformatted>}
          />
        )}

        {password.length === 0 ? undefined : (
          <DescriptionSection
            dKey={t("Password")}
            dValue={<Preformatted>{password}</Preformatted>}
          />
        )}

        <DescriptionSection
          dKey={t("Host")}
          dValue={<Preformatted>{host}</Preformatted>}
        />

        <DescriptionSection
          dKey={t("Hostname")}
          dValue={<Preformatted>{hostname}</Preformatted>}
        />

        {explicitPort && (
          <DescriptionSection
            dKey={t("Port")}
            dValue={<Preformatted>{explicitPort}</Preformatted>}
          />
        )}
      </DescriptionList>

      <Heading level={headingLevel}>{t("Pathname Details")}</Heading>

      <DescriptionList>
        <DescriptionSection
          dKey={t("Pathname")}
          dValue={<Preformatted>{pathname}</Preformatted>}
        />
      </DescriptionList>

      {transformedSearchParams.size === 0 ? undefined : (
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
              <List
                isOrdered
                items={Array.from(value).map((value, index) => (
                  <Preformatted key={index}>{value}</Preformatted>
                ))}
              />
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
    transformedSearchParams.set(key, value);
  }

  return transformedSearchParams;
}
