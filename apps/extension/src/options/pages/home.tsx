import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";

export function HomePage() {
  const heading = "Options";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>There are no options currently</OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}
