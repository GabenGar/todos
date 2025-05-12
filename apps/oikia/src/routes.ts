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
] satisfies RouteConfig;

export default routes;
