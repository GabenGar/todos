import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { List, ListItem } from "@repo/ui/lists";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { authenticateRequest } from "#server/lib/router";
import { LinkInternal } from "#components/link";
import { Form } from "#components/forms";

import type { Route } from "./+types/home";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Oikia" }];
}

function HomePage({ loaderData }: Route.ComponentProps) {
  const { isRegistered } = loaderData;
  const heading = "Hello World";
  const formID = "logout";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <DescriptionList>
                <DescriptionSection
                  dKey="Authentication"
                  dValue={
                    isRegistered ? (
                      <List>
                        <ListItem>
                          <LinkInternal href={href("/account")}>
                            Account
                          </LinkInternal>
                        </ListItem>
                        <ListItem>
                          <Form
                            id={formID}
                            method="POST"
                            action={href("/authentication/logout")}
                            submitButton={() => <>Log out</>}
                          />
                        </ListItem>
                      </List>
                    ) : (
                      <List>
                        <ListItem>
                          <LinkInternal
                            href={href("/authentication/registration")}
                          >
                            Register
                          </LinkInternal>
                        </ListItem>

                        <ListItem>
                          <LinkInternal href={href("/authentication/login")}>
                            Log in
                          </LinkInternal>
                        </ListItem>
                      </List>
                    )
                  }
                />
              </DescriptionList>
            </OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    await authenticateRequest(request);
  } catch (error) {
    const props = {
      isRegistered: false,
    };

    return props;
  }

  const props = {
    isRegistered: true,
  };

  return props;
}

export default HomePage;
