import { useActionData, type ActionFunctionArgs } from "react-router";
import { Overview, OverviewHeader, OverviewBody } from "@repo/ui/articles";
import { Page } from "@repo/ui/pages";
import { Form } from "#popup/components/forms";
import { InputSectionText } from "#popup/components/forms/section";
import { URLViewer } from "./viewer";

export function HomePage() {
  const url = useActionData<Awaited<ReturnType<typeof action>>>();
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
            <OverviewBody>
              {!url || !(url instanceof URL) ? (
                <>No URL is selected.</>
              ) : (
                <URLViewer headingLevel={2} url={url} />
              )}
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<Error | URL> {
  try {
    if (request.method !== "POST") {
      throw new Error(`Unknown method "${request.method}".`);
    }

    const data = await request.formData();

    const inputURL = data.get("url") as string | null;

    if (!inputURL) {
      throw new Error("URL is required.");
    }

    const url = new URL(inputURL);

    return url;
  } catch (error) {
    return error;
  }
}
