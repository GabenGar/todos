import {
  createHashRouter,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import { Preformatted } from "@repo/ui/formatting";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Layout } from "#options/components/layouts";
import { HomePage } from "./pages/home";

export const router = createHashRouter([
  {
    element: <Layout />,
    errorElement: <RootError />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

function RootError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const { status, statusText, data } = error;

    return (
      <DescriptionList>
        <DescriptionSection
          dKey="Status"
          dValue={<Preformatted>{status}</Preformatted>}
        />
        <DescriptionSection
          dKey="Message"
          dValue={<Preformatted>{statusText}</Preformatted>}
        />
        <DescriptionSection
          dKey="Data"
          dValue={<Preformatted>{String(data)}</Preformatted>}
        />
      </DescriptionList>
    );
  }

  if (error instanceof Error) {
    const { name, message } = error;

    return (
      <DescriptionList>
        <DescriptionSection
          dKey="Name"
          dValue={<Preformatted>{name}</Preformatted>}
        />
        <DescriptionSection
          dKey="Message"
          dValue={<Preformatted>{message}</Preformatted>}
        />
      </DescriptionList>
    );
  }

  return (
    <DescriptionList>
      <DescriptionSection
        dKey="name"
        dValue={<Preformatted>Unknown Error</Preformatted>}
      />
      <DescriptionSection
        dKey="Message"
        dValue={<Preformatted>{String(error)}</Preformatted>}
      />
    </DescriptionList>
  );
}
