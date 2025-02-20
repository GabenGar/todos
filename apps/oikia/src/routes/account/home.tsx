import { Page } from "@repo/ui/pages";
import type { Route } from "./+types/home";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Account" }];
}

function RegistrationPage({ loaderData }: Route.ComponentProps) {
  const heading = "Account";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>acc</OverviewHeader>
            <OverviewBody>details</OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ params }: Route.LoaderArgs) {
  throw new Error("Not Implemented.")
}

export default RegistrationPage;
