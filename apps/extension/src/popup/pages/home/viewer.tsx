import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { Heading, type IHeadingLevel } from "@repo/ui/headings";

import styles from "./viewer.module.scss";

interface IURLViewerProps {
  url: URL;
  headingLevel: IHeadingLevel;
}

interface ITransformedSearchParams extends Map<string, string | Set<string>> {}

export function URLViewer({ headingLevel, url }: IURLViewerProps) {
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
      <Heading level={headingLevel}>URLs</Heading>
      <DescriptionList>
        <DescriptionSection
          dKey="Full URL"
          dValue={<Preformatted>{href}</Preformatted>}
        />
        <DescriptionSection
          dKey="Transformed URL"
          dValue={
            <Preformatted>
              {decodeURIComponent(String(transformedURL))}
            </Preformatted>
          }
        />
      </DescriptionList>

      <Heading level={headingLevel}>Origin Details</Heading>

      <DescriptionList>
        <DescriptionSection
          dKey="Origin"
          dValue={<Preformatted>{origin}</Preformatted>}
        />

        <DescriptionSection
          dKey="Protocol"
          dValue={<Preformatted>{protocol}</Preformatted>}
        />

        {username.length === 0 ? undefined : (
          <DescriptionSection
            dKey="Username"
            dValue={<Preformatted>{username}</Preformatted>}
          />
        )}

        {password.length === 0 ? undefined : (
          <DescriptionSection
            dKey="Password"
            dValue={<Preformatted>{password}</Preformatted>}
          />
        )}

        <DescriptionSection
          dKey="Host"
          dValue={<Preformatted>{host}</Preformatted>}
        />

        <DescriptionSection
          dKey="Hostname"
          dValue={<Preformatted>{hostname}</Preformatted>}
        />

        {explicitPort && (
          <DescriptionSection
            dKey="Port"
            dValue={<Preformatted>{explicitPort}</Preformatted>}
          />
        )}
      </DescriptionList>

      <Heading level={headingLevel}>Pathname Details</Heading>

      <DescriptionList>
        <DescriptionSection
          dKey={"Pathname"}
          dValue={<Preformatted>{pathname}</Preformatted>}
        />
      </DescriptionList>

      {transformedSearchParams.size === 0 ? undefined : (
        <>
          <Heading level={headingLevel}>Search Parameters Details</Heading>

          <DescriptionList>
            <DescriptionSection
              dKey="Search"
              dValue={<Preformatted>{search}</Preformatted>}
            />

            <DescriptionSection
              dKey="Search parameters"
              dValue={
                <TransformedSearchParams params={transformedSearchParams} />
              }
            />
          </DescriptionList>
        </>
      )}

      {hash.length === 0 ? undefined : (
        <>
          <Heading level={headingLevel}>Fragment Details</Heading>
          <DescriptionList>
            <DescriptionSection
              dKey="Hash"
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
              <ol>
                {Array.from(value).map((value, index) => (
                  <li
                    key={`${key}${value}${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
