import { Page } from "@repo/ui/pages";
import type { Route } from "./+types/logout";
import { Overview } from "@repo/ui/articles";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Logout" }];
}

function LogoutPage() {
  const heading = "Logout";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>{}</Overview>
    </Page>
  );
}

export async function action() {
  throw new Error("Not Implemented.");
}

export default LogoutPage;
