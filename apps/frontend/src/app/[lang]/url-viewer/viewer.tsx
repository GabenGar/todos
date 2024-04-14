import type { ILocalizationPage } from "#lib/localization";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionSection,
  DescriptionTerm,
} from "#components";
import { Pre } from "#components/pre";

interface IURLViewerProps {
  translation: ILocalizationPage["url-viewer"];
  url: URL;
}

export function URLViewer({ translation, url }: IURLViewerProps) {
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
  const explicitSearchParams =
    searchParams.size === 0 ? undefined : Array.from(searchParams);

  return (
    <>
      <DescriptionList>
        <DescriptionSection
          dKey={translation["Full URL"]}
          dValue={<Pre>{href}</Pre>}
        />
      </DescriptionList>

      <DescriptionList>
        <DescriptionSection
          dKey={translation["Origin"]}
          dValue={<Pre>{origin}</Pre>}
        />
      </DescriptionList>

      <DescriptionList>
        <DescriptionSection
          dKey={translation["Protocol"]}
          dValue={<Pre>{protocol}</Pre>}
        />
      </DescriptionList>

      {username.length === 0 ? undefined : (
        <DescriptionList>
          <DescriptionSection
            dKey={translation["Username"]}
            dValue={<Pre>{username}</Pre>}
          />
        </DescriptionList>
      )}

      {password.length === 0 ? undefined : (
        <DescriptionList>
          <DescriptionSection
            dKey={translation["Password"]}
            dValue={<Pre>{password}</Pre>}
          />
        </DescriptionList>
      )}

      <DescriptionList>
        <DescriptionSection
          dKey={translation["Host"]}
          dValue={<Pre>{host}</Pre>}
        />
      </DescriptionList>

      <DescriptionList>
        <DescriptionSection
          dKey={translation["Hostname"]}
          dValue={<Pre>{hostname}</Pre>}
        />
      </DescriptionList>

      {explicitPort && (
        <DescriptionList>
          <DescriptionSection
            dKey={translation["Port"]}
            dValue={<Pre>{explicitPort}</Pre>}
          />
        </DescriptionList>
      )}

      <DescriptionList>
        <DescriptionSection
          dKey={translation["Pathname"]}
          dValue={<Pre>{pathname}</Pre>}
        />
      </DescriptionList>

      {explicitSearchParams && (
        <DescriptionList>
          <DescriptionSection
            dKey={translation["Search"]}
            dValue={<Pre>{search}</Pre>}
          />
        </DescriptionList>
      )}

      {explicitSearchParams && (
        <DescriptionList>
          <DescriptionSection
            dKey={translation["Search parameters"]}
            dValue={
              <DescriptionList>
                {explicitSearchParams.map(([key, value]) => (
                  <DescriptionSection key={key}>
                    <DescriptionTerm>
                      <Pre>{key}:</Pre>
                    </DescriptionTerm>
                    <DescriptionDetails>
                      <Pre>{value}</Pre>
                    </DescriptionDetails>
                  </DescriptionSection>
                ))}
              </DescriptionList>
            }
          />
        </DescriptionList>
      )}

      {hash.length === 0 ? undefined : (
        <DescriptionList>
          <DescriptionSection
            dKey={translation["Hash"]}
            dValue={<Pre>{hash}</Pre>}
          />
        </DescriptionList>
      )}
    </>
  );
}
