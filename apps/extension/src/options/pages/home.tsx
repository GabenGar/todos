import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { Heading } from "@repo/ui/headings";
import { List } from "@repo/ui/lists";
import { getLocalizedMessage } from "#lib/localization";
import { availablePermissions } from "#lib/permissions";
import { settingKeys } from "#lib/settings";
import { Loading } from "#components/loading";
import { usePermissions } from "#options/hooks";
import { Permission } from "#options/components/permissions";
import { Setting } from "#options/components/settings";

export function HomePage() {
  const permissions = usePermissions();
  const heading = getLocalizedMessage("Options");

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {(headingLevel) => (
          <>
            <OverviewHeader>
              <List>
                {settingKeys.map((key) => (
                  <li key={key}>
                    <Setting setting={key} />
                  </li>
                ))}
              </List>
            </OverviewHeader>

            <OverviewBody>
              <Heading level={headingLevel + 1}>
                {getLocalizedMessage("Browser Permissions")}
              </Heading>
              {!permissions ? (
                <Loading />
              ) : (
                <List>
                  {availablePermissions.map((perm) => (
                    <li key={perm}>
                      <Permission permission={perm} />
                    </li>
                  ))}
                </List>
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}
