import { createMemoryRouter, type RouteObject } from "react-router";
import { Layout } from "#popup/components/layouts";
import { HomePage } from "#popup/pages/home";

export const routes = createMemoryRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
