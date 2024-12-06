import { useActionData, type ActionFunctionArgs,  } from "react-router";
import { Overview, OverviewHeader, OverviewBody } from "@repo/ui/articles";
import { Page } from "@repo/ui/pages";
import { Form } from "#popup/components/forms";
import { InputSectionText } from "#popup/components/forms/section";

export function HomePage() {
  const data: Awaited<ReturnType<typeof action>> | undefined = useActionData();
  const heading = "URL parser";
  const formID = "input-url";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <Form id={formID} method="POST">
                {(formID) => (
                  <>
                    <InputSectionText
                      name="url"
                      id={`${formID}-url`}
                      form={formID}
                    >
                      URL
                    </InputSectionText>
                  </>
                )}
              </Form>
            </OverviewHeader>
            <OverviewBody>Result</OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function action({ request }: ActionFunctionArgs): Promise<Error | URL> {
  try {

  } catch (error) {
    return error
  }
}
