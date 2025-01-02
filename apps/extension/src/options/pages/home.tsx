import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { Heading } from "@repo/ui/headings";
import { getLocalizedMessage } from "#lib/localization";
import { usePermissions } from "#options/hooks";
import { availablePermissions } from "#permissions";
import { settings } from "#settings";
import { Permission } from "#components/permissions";
import { Loading } from "#components/loading";

export function HomePage() {
  const permissions = usePermissions();
  const heading = getLocalizedMessage("Options");

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <ul>
                {Object.entries(settings).map(([key, message]) => (
                  <li key={key}>{getLocalizedMessage(message)}</li>
                ))}
              </ul>
            </OverviewHeader>
            <OverviewBody>
              <Heading level={headingLevel + 1}>
                {getLocalizedMessage("Browser Permissions")}
              </Heading>
              {!permissions ? (
                <Loading/>
              ) : (
                <ul>
                  {availablePermissions.map((perm) => (
                    <li key={perm}>
                      <Permission permission={perm} />
                    </li>
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
