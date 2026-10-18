import {
  createMemoryRouter,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { page as HomePage, action as HomePageAction } from "#action/pages/home";
import { ActionLayout } from "#components/layout";

export const routes = createMemoryRouter([
  {
    element: <ActionLayout />,
    errorElement: <RootError />,
    children: [
      {
        index: true,
        element: <HomePage />,
        action: HomePageAction,
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
          dKey={"Status"}
          dValue={<Preformatted>{status}</Preformatted>}
        />
        <DescriptionSection
          dKey={"Message"}
          dValue={<Preformatted>{statusText}</Preformatted>}
        />
        <DescriptionSection
          dKey={"Data"}
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
          dKey={"Name"}
          dValue={<Preformatted>{name}</Preformatted>}
        />
        <DescriptionSection
          dKey={"Message"}
          dValue={<Preformatted>{message}</Preformatted>}
        />
      </DescriptionList>
    );
  }

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={"Name"}
        dValue={
          <Preformatted>{"Unknown Error"}</Preformatted>
        }
      />
      <DescriptionSection
        dKey={"Message"}
        dValue={<Preformatted>{String(error)}</Preformatted>}
      />
    </DescriptionList>
  );
}
