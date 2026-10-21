import { useLoaderData } from "react-router";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { Page } from "@repo/ui/pages";
import { useTranslation } from "#hooks";

export function HomePage() {
  const { t } = useTranslation();
  const data = useLoaderData<typeof loader>();
  const heading = t((t) => t.action.heading);

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}></Overview>
    </Page>
  );
}

export async function loader() {
  return null;
}
