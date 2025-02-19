import type { Route } from "./+types/authentication/registration";

export function meta({ error }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function RegistrationPage({}: Route.ComponentProps) {
  return <>Hello World</>;
}

export async function loader({ params }: Route.LoaderArgs) {
  return { name: "Hello World" };
}

export default RegistrationPage;
