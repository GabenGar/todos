import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/login";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Login" }];
}

function LoginPage() {
  const heading = "Login";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <p>
                Not registered?{" "}
                <LinkInternal href={"/authentication/registration"}>
                  Register.
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

export default LoginPage;
