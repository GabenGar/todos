import { useActionData, type ActionFunctionArgs } from "react-router";
import { Overview, OverviewHeader, OverviewBody } from "@repo/ui/articles";
import { Page } from "@repo/ui/pages";
import { getLocalizedMessage } from "#lib/localization";
import { URLViewer } from "#components/urls";
import { Form } from "#popup/components/forms";
import { InputSectionText } from "#popup/components/forms/section";

export function HomePage() {
  const url = useActionData<Awaited<ReturnType<typeof action>>>();
  const heading = getLocalizedMessage("URL parser");
  const formID = "input-url";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <Form
                id={formID}
                method="POST"
                submitButton={() => getLocalizedMessage("Analyze")}
              >
                {(formID) => (
                  <>
                    <InputSectionText
                      name="url"
                      id={`${formID}-url`}
                      form={formID}
                    >
                      {getLocalizedMessage("URL")}
                    </InputSectionText>
                  </>
                )}
              </Form>
            </OverviewHeader>
            <OverviewBody>
              {!url || !(url instanceof URL) ? (
                getLocalizedMessage("No URL is selected.")
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
      throw new Error(
        getLocalizedMessage("Unknown method $METHOD$", request.method)
      );
    }

    const data = await request.formData();

    const inputURL = data.get("url") as string | null;

    if (!inputURL) {
      throw new Error(getLocalizedMessage("URL is required."));
    }

    const url = new URL(inputURL);

    return url;
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }
    return error;
  }
}
