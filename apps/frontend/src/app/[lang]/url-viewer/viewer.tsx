import type { ILocalizationPage } from "#lib/localization";
import { DescriptionList, DescriptionSection } from "#components";
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

      <DescriptionList>
        <DescriptionSection
          dKey={translation["Port"]}
          dValue={<Pre>{port}</Pre>}
        />
      </DescriptionList>

      <DescriptionList>
        <DescriptionSection
          dKey={translation["Pathname"]}
          dValue={<Pre>{pathname}</Pre>}
        />
      </DescriptionList>

      {searchParams.size === 0 ? undefined : (
        <DescriptionList>
          <DescriptionSection
            dKey={translation["Search"]}
            dValue={<Pre>{search}</Pre>}
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
