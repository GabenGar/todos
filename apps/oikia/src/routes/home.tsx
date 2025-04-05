import { Page } from "@repo/ui/pages";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { List, ListItem } from "@repo/ui/lists";
import { LinkInternal } from "#components/link";

import type { Route } from "./+types/home";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Oikia" }];
}

function Home() {
  const heading = "Hello World";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <List>
                <ListItem>
                  <LinkInternal href="/authentication/registration">
                    Register
                  </LinkInternal>
                </ListItem>
              </List>
            </OverviewHeader>
          </>
        )}
      </Overview>
    </Page>
  );
}

export default Home;
