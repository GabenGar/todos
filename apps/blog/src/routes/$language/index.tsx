import { createFileRoute } from "@tanstack/react-router";
import { Overview, OverviewHeader } from "@repo/ui/articles";
import { List, ListItem } from "@repo/ui/lists";
import { Page } from "@repo/ui/pages";
import { LinkInternal } from "#components/links";
import { useTranslation } from "#hooks";
import { createMetaTitle } from "#lib/pages";

function HomePage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const title = createMetaTitle(t((t) => t.page.home.title));
  const heading = t((t) => t.page.home.heading);

  return (
    <Page title={title} heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <OverviewHeader>
            <List>
              <ListItem>
                <LinkInternal
                  to={"/$language/blog/posts/$page"}
                  params={{
                    language,
                    page: "1",
                  }}
                >
                  {t((t) => t.page.home["link-posts"])}
                </LinkInternal>
              </ListItem>

              <ListItem>
                <LinkInternal
                  to={"/$language/blog/authors/$page"}
                  params={{
                    language,
                    page: "1",
                  }}
                >
                  {t((t) => t.page.home["link-authors"])}
                </LinkInternal>
              </ListItem>
            </List>
          </OverviewHeader>
        )}
      </Overview>
    </Page>
  );
}

export const Route = createFileRoute("/$language/")({
  component: HomePage,
});
