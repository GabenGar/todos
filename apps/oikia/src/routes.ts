import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes = [
  index("routes/home.tsx"),
  route(
    "authentication/registration",
    "./routes/authentication/registration.tsx",
  ),
  route("authentication/login", "./routes/authentication/login.tsx"),
  route("authentication/logout", "./routes/authentication/logout.tsx"),
  route("account", "./routes/account/home.tsx"),
  route("account/role/administrator", "./routes/account/role/administrator/home.tsx"),
  route("account/role/administrator/invitations", "./routes/account/role/administrator/invitations.tsx"),
] satisfies RouteConfig;

export default routes;
