import { href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { List, ListItem } from "@repo/ui/lists";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/home";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Oikia" }];
}

function HomePage() {
  const heading = "Hello World";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <DescriptionList>
                <DescriptionSection
                  dKey="Authentication"
                  // @TODO client-side auth check
                  dValue={
                    <List>
                      <ListItem>
                        <LinkInternal href={href("/account")}>
                          Account
                        </LinkInternal>
                      </ListItem>
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

export default HomePage;
