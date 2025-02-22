import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { parseStringValueFromFormData } from "@repo/ui/forms";
import { InputSectionText } from "@repo/ui/forms/sections";
import { LinkInternal } from "#components/link";
import { Form } from "#components/forms";
import type { IAccountInit } from "#entities/account";

import type { Route } from "./+types/registration";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Registration" }];
}

function RegistrationPage({ loaderData }: Route.ComponentProps) {
  const heading = "Registration";
  const formID = "registration";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <p>
                Already registered?{" "}
                <LinkInternal href={"/authentication/login"}>
                  Login.
                </LinkInternal>
              </p>
            </OverviewHeader>

            <OverviewBody>
              <Form id={formID} method="POST" submitButton={() => "Register"}>
                {(formID) => (
                  <>
                    <InputSectionText
                      id={`${formID}-login`}
                      form={formID}
                      name="login"
                      required
                    >
                      Login
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-password`}
                      form={formID}
                      name="password"
                      required
                    >
                      Password
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-invitation`}
                      form={formID}
                      name="invitation"
                      required
                    >
                      Invitation code
                    </InputSectionText>

                    <InputSectionText
                      id={`${formID}-name`}
                      form={formID}
                      name="name"
                    >
                      Display name
                    </InputSectionText>
                  </>
                )}
              </Form>
            </OverviewBody>
          </>
        )}
      </Overview>
    </Page>
  );
}

export async function action({ request }: Route.ActionArgs) {
  try {
    switch (request.method) {
      case "POST": {
        const formData = await request.formData();

        let login: string | undefined = undefined;
        {
          const value = parseStringValueFromFormData(formData, "login");

          if (!value) {
            throw new Error("Login is required.");
          }

          login = value;
        }

        let password: string | undefined = undefined;
        {
          const value = parseStringValueFromFormData(formData, "password");

          if (!value) {
            throw new Error("Password is required.");
          }

          password = value;
        }

        let invitation: string | undefined = undefined;
        {
          const value = parseStringValueFromFormData(formData, "invitation");

          if (!value) {
            throw new Error("Invitation code is required.");
          }

          invitation = value;
        }

        const name = parseStringValueFromFormData(formData, "name");

        const accountInit: IAccountInit = {
          login,
          password,
          invitation,
          name,
        };

        throw new Error("Not Implemented.");
      }

      default: {
        throw new Error(`Unknown method "${request.method}".`);
      }
    }
  } catch (error) {
    return error;
  }
}

export default RegistrationPage;
