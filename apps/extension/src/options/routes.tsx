import {
  createHashRouter,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import { Preformatted } from "@repo/ui/formatting";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { getLocalizedMessage } from "#lib/localization";
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
], {
  future: {
    v7_partialHydration: true,
  },
});

function RootError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const { status, statusText, data } = error;

    return (
      <DescriptionList>
        <DescriptionSection
          dKey={getLocalizedMessage("Status")}
          dValue={<Preformatted>{status}</Preformatted>}
        />
        <DescriptionSection
          dKey={getLocalizedMessage("Message")}
          dValue={<Preformatted>{statusText}</Preformatted>}
        />
        <DescriptionSection
          dKey={getLocalizedMessage("Data")}
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
          dKey={getLocalizedMessage("Name")}
          dValue={<Preformatted>{name}</Preformatted>}
        />
        <DescriptionSection
          dKey={getLocalizedMessage("Message")}
          dValue={<Preformatted>{message}</Preformatted>}
        />
      </DescriptionList>
    );
  }

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={getLocalizedMessage("Name")}
        dValue={
          <Preformatted>{getLocalizedMessage("Unknown Error")}</Preformatted>
        }
      />
      <DescriptionSection
        dKey={getLocalizedMessage("Message")}
        dValue={<Preformatted>{String(error)}</Preformatted>}
      />
    </DescriptionList>
  );
}
