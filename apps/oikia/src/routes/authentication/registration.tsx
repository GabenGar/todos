import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/registration";

export function meta({ data }: Route.MetaArgs) {
  return [{ title: "Registration" }];
}

function RegistrationPage({ loaderData }: Route.ComponentProps) {
  const heading = "Registration";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <p>
                Already registered?{" "}
                <LinkInternal href={"/authentication/login"}>
                  Login.
                </LinkInternal>
              </p>
            </OverviewHeader>

            <OverviewBody>Form goes there</OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function action() {
  throw new Error("Not Implemented.");
}

export default RegistrationPage;
