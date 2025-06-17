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
  route(
    "account/role/administrator",
    "./routes/account/role/administrator/home.tsx",
  ),
  route(
    "account/role/administrator/create/invitation",
    "./routes/account/role/administrator/create/invitation.tsx",
  ),
  route(
    "account/role/administrator/account/:id",
    "./routes/account/role/administrator/account.tsx",
  ),
  route(
    "account/role/administrator/accounts",
    "./routes/account/role/administrator/accounts.tsx",
  ),
  route(
    "account/role/administrator/accounts/:page",
    "./routes/account/role/administrator/accounts-list.tsx",
  ),
  route(
    "account/role/administrator/invitations",
    "./routes/account/role/administrator/invitations.tsx",
  ),
  route(
    "account/role/administrator/invitations/:page",
    "./routes/account/role/administrator/invitations-list.tsx",
  ),
  route(
    "account/role/administrator/invitation/:id",
    "./routes/account/role/administrator/invitation/overview.tsx",
  ),
  route(
    "account/role/administrator/invitation/:id/accounts",
    "./routes/account/role/administrator/invitation/accounts.tsx",
  ),
  route(
    "account/role/administrator/invitation/:id/accounts/:page",
    "./routes/account/role/administrator/invitation/accounts-list.tsx",
  ),
] satisfies RouteConfig;

export default routes;
