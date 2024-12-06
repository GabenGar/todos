import { Overview, OverviewHeader, OverviewBody } from "@repo/ui/articles";
import { Page } from "@repo/ui/pages";

export function HomePage() {
  const heading = "URL parser";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>Paste URL there</OverviewHeader>
            <OverviewBody>Result</OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}
