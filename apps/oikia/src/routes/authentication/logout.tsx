import type { Route } from "./+types/authentication/logout";

export function meta({ error }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function LogoutPage() {
  return <>Hello World</>;
}

export default LogoutPage;
