import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { getLocalizedMessage } from "#lib/localization";

export function HomePage() {
  const heading = getLocalizedMessage("Options");

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              {getLocalizedMessage("There are no options currently.")}
            </OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}
