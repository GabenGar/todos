import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { Heading, type IHeadingLevel } from "@repo/ui/headings";
import { getLocalizedMessage } from "#lib/localization";

import styles from "./viewer.module.scss";

interface IURLViewerProps {
  url: URL;
  headingLevel: IHeadingLevel;
}

interface ITransformedSearchParams extends Map<string, string | Set<string>> {}

export function URLViewer({ headingLevel, url }: IURLViewerProps) {
  const { href, origin, pathname, search, searchParams, hash } = url;
  const transformedSearchParams = transformSearchparams(searchParams);
  const transformedURL = transformURL(url);
  const decodedURL = decodeURIComponent(String(transformedURL));

  return (
    <>
      <Heading level={headingLevel}>{getLocalizedMessage("URLs")}</Heading>
      <DescriptionList>
        <DescriptionSection
          dKey={getLocalizedMessage("Full URL")}
          dValue={<Preformatted>{href}</Preformatted>}
        />

        {href !== decodedURL && (
          <DescriptionSection
            dKey={getLocalizedMessage("Decoded URL")}
            dValue={<Preformatted>{decodedURL}</Preformatted>}
          />
        )}
      </DescriptionList>

      {origin && (
        <>
          <Heading level={headingLevel}>
            {getLocalizedMessage("Origin Details")}
          </Heading>

          <Origin url={url} />
        </>
      )}

      <Heading level={headingLevel}>
        {getLocalizedMessage("Pathname Details")}
      </Heading>

      <DescriptionList>
        <DescriptionSection
          dKey={getLocalizedMessage("Pathname")}
          dValue={<Preformatted>{pathname}</Preformatted>}
        />
      </DescriptionList>

      {transformedSearchParams.size === 0 ? undefined : (
        <>
          <Heading level={headingLevel}>
            {getLocalizedMessage("Search Parameters Details")}
          </Heading>

          <DescriptionList>
            <DescriptionSection
              dKey={getLocalizedMessage("Search")}
              dValue={<Preformatted>{search}</Preformatted>}
            />

            <DescriptionSection
              dKey={getLocalizedMessage("Search parameters")}
              dValue={
                <TransformedSearchParams params={transformedSearchParams} />
              }
            />
          </DescriptionList>
        </>
      )}

      {hash.length === 0 ? undefined : (
        <>
          <Heading level={headingLevel}>
            {getLocalizedMessage("Fragment Details")}
          </Heading>
          <DescriptionList>
            <DescriptionSection
              dKey={getLocalizedMessage("Hash")}
              dValue={<Preformatted>{hash}</Preformatted>}
            />
          </DescriptionList>
        </>
      )}
    </>
  );
}

interface IOriginProps {
  url: URL;
}

function Origin({ url }: IOriginProps) {
  const { origin, protocol, username, password, host, hostname, port } = url;
  const explicitOrigin = !origin ? origin : port
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
        dKey={getLocalizedMessage("Origin")}
        dValue={<Preformatted>{explicitOrigin}</Preformatted>}
      />

      <DescriptionSection
        dKey={getLocalizedMessage("Protocol")}
        dValue={<Preformatted>{protocol}</Preformatted>}
      />

      {username.length === 0 ? undefined : (
        <DescriptionSection
          dKey={getLocalizedMessage("Username")}
          dValue={<Preformatted>{username}</Preformatted>}
        />
      )}

      {password.length === 0 ? undefined : (
        <DescriptionSection
          dKey={getLocalizedMessage("Password")}
          dValue={<Preformatted>{password}</Preformatted>}
        />
      )}

      {host && (
        <DescriptionSection
          dKey={getLocalizedMessage("Host")}
          dValue={<Preformatted>{explicitHost}</Preformatted>}
        />
      )}

      {hostname && (
        <DescriptionSection
          dKey={getLocalizedMessage("Hostname")}
          dValue={<Preformatted>{hostname}</Preformatted>}
        />
      )}

      {explicitPort && (
        <DescriptionSection
          dKey={getLocalizedMessage("Port")}
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
              <ol>
                {Array.from(value).map((value, index) => (
                  <li
                    key={`${key}${value}${
                      // biome-ignore lint/suspicious/noArrayIndexKey: no explanation
                      index
                    }`}
                  >
                    <Preformatted>{value}</Preformatted>
                  </li>
                ))}
              </ol>
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
