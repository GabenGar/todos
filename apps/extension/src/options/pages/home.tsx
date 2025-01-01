import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { Loading } from "@repo/ui/loading";
import { Heading } from "@repo/ui/headings";
import { getLocalizedMessage } from "#lib/localization";
import { usePermissions } from "#options/hooks";

export function HomePage() {
  const permissions = usePermissions();
  const heading = getLocalizedMessage("Options");

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              {getLocalizedMessage("There are no options currently.")}
            </OverviewHeader>
            <OverviewBody>
              <Heading level={headingLevel + 1}>
                {getLocalizedMessage("Browser Permissions")}
              </Heading>
              {!permissions ? (
                <Loading>{getLocalizedMessage("Loading...")}</Loading>
              ) : permissions.size === 0 ? (
                <p>{getLocalizedMessage("No permissions are granted.")}</p>
              ) : (
                <ul>
                  {Array.from(permissions).map((perm) => (
                    <li key={perm}>{perm}</li>
                  ))}
                </ul>
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}
