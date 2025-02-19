import type { Route } from "./+types/authentication/login";

export function meta({ error }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function LoginPage() {
  return <>Hello World</>;
}

export default LoginPage;
