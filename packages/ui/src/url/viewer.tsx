import { DescriptionList, DescriptionSection } from "#description-list";
import { Details } from "#details";
import { Preformatted } from "#formatting";
import { Heading, type IHeadingLevel } from "#headings";
import { useTranslation } from "#hooks";
import { Origin } from "./origin";
import {
  type ITransformedSearchParams,
  TransformedSearchParams,
} from "./params";
import { Pathname } from "./pathname";

export interface IURLViewerProps {
  url: URL;
  headingLevel: IHeadingLevel;
}

export function URLViewer({ headingLevel, url }: IURLViewerProps) {
  const { t } = useTranslation();
  const { href, origin, pathname, search, searchParams, hash } = url;
  const transformedSearchParams = transformSearchparams(searchParams);
  const transformedURL = transformURL(url);
  const decodedURL = decodeURIComponent(String(transformedURL));

  return (
    <>
      <Heading level={headingLevel}>{t((t) => t.url["URLs"])}</Heading>
      <DescriptionList>
        <DescriptionSection
          dKey={t((t) => t.url["Full URL"])}
          dValue={<Preformatted>{href}</Preformatted>}
        />
        {href !== decodedURL && (
          <DescriptionSection
            dKey={t((t) => t.url["Decoded URL"])}
            dValue={<Preformatted>{decodedURL}</Preformatted>}
          />
        )}
      </DescriptionList>

      {origin && (
        <Details
          summary={
            <Heading level={headingLevel}>
              {t((t) => t.url["Origin Details"])}
            </Heading>
          }
        >
          <Origin t={t} url={url} />
        </Details>
      )}

      <Details
        summary={
          <Heading level={headingLevel}>
            {t((t) => t.url["Pathname Details"])}
          </Heading>
        }
      >
        <Pathname t={t} pathname={pathname} />
      </Details>

      {transformedSearchParams.size !== 0 && (
        <>
          <Heading level={headingLevel}>
            {t((t) => t.url["Search Parameters Details"])}
          </Heading>

          <DescriptionList>
            <DescriptionSection
              dKey={t((t) => t.url["Search"])}
              dValue={<Preformatted>{search}</Preformatted>}
            />

            <DescriptionSection
              dKey={t((t) => t.url["Search parameters"])}
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
            {t((t) => t.url["Fragment Details"])}
          </Heading>
          <DescriptionList>
            <DescriptionSection
              dKey={t((t) => t.url["Hash"])}
              dValue={<Preformatted>{hash}</Preformatted>}
            />
          </DescriptionList>
        </>
      )}
    </>
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
    // @ts-ignore
    transformedSearchParams.set(key, value);
  }

  return transformedSearchParams;
}
