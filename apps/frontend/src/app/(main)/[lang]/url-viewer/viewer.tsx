import type { ILocalizationPage } from "#lib/localization";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "#components";
import { Pre } from "#components/pre";
import { Heading, type IHeadingLevel } from "#components/heading";
import { List } from "#components/list";

import styles from "./viewer.module.scss";

interface IURLViewerProps {
  translation: ILocalizationPage["url-viewer"];
  url: URL;
  headingLevel: IHeadingLevel;
}

interface ITransformedSearchParams extends Map<string, string | Set<string>> {}

export function URLViewer({ translation, headingLevel, url }: IURLViewerProps) {
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
      <Heading level={headingLevel}>{translation["URLs"]}</Heading>
      <DescriptionList>
        <DescriptionSection
          dKey={translation["Full URL"]}
          dValue={<Pre>{href}</Pre>}
        />
        <DescriptionSection
          dKey={translation["Transformed URL"]}
          dValue={<Pre>{decodeURIComponent(String(transformedURL))}</Pre>}
        />
      </DescriptionList>

      <Heading level={headingLevel}>{translation["Origin Details"]}</Heading>

      <DescriptionList>
        <DescriptionSection
          dKey={translation["Origin"]}
          dValue={<Pre>{origin}</Pre>}
        />

        <DescriptionSection
          dKey={translation["Protocol"]}
          dValue={<Pre>{protocol}</Pre>}
        />

        {username.length === 0 ? undefined : (
          <DescriptionSection
            dKey={translation["Username"]}
            dValue={<Pre>{username}</Pre>}
          />
        )}

        {password.length === 0 ? undefined : (
          <DescriptionSection
            dKey={translation["Password"]}
            dValue={<Pre>{password}</Pre>}
          />
        )}

        <DescriptionSection
          dKey={translation["Host"]}
          dValue={<Pre>{host}</Pre>}
        />

        <DescriptionSection
          dKey={translation["Hostname"]}
          dValue={<Pre>{hostname}</Pre>}
        />

        {explicitPort && (
          <DescriptionSection
            dKey={translation["Port"]}
            dValue={<Pre>{explicitPort}</Pre>}
          />
        )}
      </DescriptionList>

      <Heading level={headingLevel}>{translation["Pathname Details"]}</Heading>

      <DescriptionList>
        <DescriptionSection
          dKey={translation["Pathname"]}
          dValue={<Pre>{pathname}</Pre>}
        />
      </DescriptionList>

      {transformedSearchParams.size === 0 ? undefined : (
        <>
          <Heading level={headingLevel}>
            {translation["Search Parameters Details"]}
          </Heading>

          <DescriptionList>
            <DescriptionSection
              dKey={translation["Search"]}
              dValue={<Pre>{search}</Pre>}
            />

            <DescriptionSection
              dKey={translation["Search parameters"]}
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
            {translation["Fragment Details"]}
          </Heading>
          <DescriptionList>
            <DescriptionSection
              dKey={translation["Hash"]}
              dValue={<Pre>{hash}</Pre>}
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
            <Pre>{key}:</Pre>
          </DescriptionTerm>
          <DescriptionDetails className={styles.params}>
            {typeof value === "string" ? (
              <Pre>{value}</Pre>
            ) : (
              <List
                isOrdered
                items={Array.from(value).map((value, index) => (
                  <Pre key={index}>{value}</Pre>
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
  searchParams: URLSearchParams,
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
