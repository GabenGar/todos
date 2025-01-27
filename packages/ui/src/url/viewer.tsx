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

import styles from "./viewer.module.scss";

interface IURLViewerProps extends ITranslatableProps<ITranslationKey> {
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
        <>
          <Heading level={headingLevel}>{t("Origin Details")}</Heading>

          <Origin t={t} url={url} />
        </>
      )}

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

interface IOriginProps extends Pick<IURLViewerProps, "t" | "url"> {}

function Origin({ t, url }: IOriginProps) {
  const { origin, protocol, username, password, host, hostname, port } = url;
  const explicitOrigin = !origin
    ? origin
    : port
      ? origin
      : protocol === "http:"
        ? `${origin}:80`
        : protocol === "https:"
          ? `${origin}:443`
          : origin;
  const explicitPort = port
    ? port
    : protocol === "http:"
      ? "80"
      : protocol === "https:"
        ? "443"
        : port;
  const explicitHost = port
    ? host
    : protocol === "http:"
      ? `${host}:80`
      : protocol === "https:"
        ? `${host}:443`
        : host;

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t("Origin")}
        dValue={<Preformatted>{explicitOrigin}</Preformatted>}
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

      {host && (
        <DescriptionSection
          dKey={t("Host")}
          dValue={<Preformatted>{explicitHost}</Preformatted>}
        />
      )}

      {hostname && (
        <DescriptionSection
          dKey={t("Hostname")}
          dValue={<Preformatted>{hostname}</Preformatted>}
        />
      )}

      {explicitPort && (
        <DescriptionSection
          dKey={t("Port")}
          dValue={<Preformatted>{explicitPort}</Preformatted>}
        />
      )}
    </DescriptionList>
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
    transformedSearchParams.set(key, value);
  }

  return transformedSearchParams;
}
