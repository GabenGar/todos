import { data } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { parseStringValueFromFormData } from "@repo/ui/forms";
import {
  InputSectionNanoID,
  InputSectionPassword,
  InputSectionText,
} from "@repo/ui/forms/sections";
import {
  createFailedAPIResponse,
  createSuccessfullAPIResponse,
} from "#server/lib/api";
import { runTransaction } from "#database";
import { registerAccount } from "#server/entities/accounts";
import { LinkInternal } from "#components/link";
import { Form } from "#components/forms";
import type { IAccountInit } from "#entities/account";

import type { Route } from "./+types/registration";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Registration" }];
}

function RegistrationPage({ actionData }: Route.ComponentProps) {
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
              <Form<Route.ComponentProps["actionData"]>
                id={formID}
                method="POST"
                submitButton={() => "Register"}
                successElement={(formID, data) => <></>}
              >
                {(formID) => (
                  <>
                    <InputSectionText
                      id={`${formID}-login`}
                      form={formID}
                      name="login"
                      minLength={5}
                      maxLength={20}
                      required
                    >
                      Login
                    </InputSectionText>

                    <InputSectionPassword
                      id={`${formID}-password`}
                      form={formID}
                      name="password"
                      autoComplete="new-password"
                      minLength={8}
                      // https://security.stackexchange.com/q/39849
                      maxLength={49}
                      required
                    >
                      Password
                    </InputSectionPassword>

                    <InputSectionNanoID
                      id={`${formID}-invitation-code`}
                      form={formID}
                      name="invitation_code"
                      required
                    >
                      Invitation code
                    </InputSectionNanoID>

                    <InputSectionText
                      id={`${formID}-name`}
                      form={formID}
                      name="name"
                      minLength={8}
                      maxLength={128}
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

          if (value.length < 5 && value.length > 20) {
            throw new Error("Invalid login length.");
          }

          login = value;
        }

        let password: string | undefined = undefined;
        {
          const value = parseStringValueFromFormData(formData, "password");

          if (!value) {
            throw new Error("Password is required.");
          }

          if (value.length < 8 && value.length > 49) {
            throw new Error("Invalid password length.");
          }

          password = value;
        }

        let invitation_code: string | undefined = undefined;
        {
          const value = parseStringValueFromFormData(
            formData,
            "invitation_code"
          );

          if (!value) {
            throw new Error("Invitation code is required.");
          }

          if (value.length !== 21) {
            throw new Error("Invalid invitation code length.");
          }

          invitation_code = value;
        }

        const name = parseStringValueFromFormData(formData, "name");

        const accountInit: IAccountInit = {
          login,
          password,
          invitation_code,
          name,
        };

        // await runTransaction(async (transaction) =>
        //   registerAccount(transaction, accountInit)
        // );

        const response = createSuccessfullAPIResponse(true);

        return response
      }

      default: {
        throw new Error(`Unknown method "${request.method}".`);
      }
    }
  } catch (error) {
    return createFailedAPIResponse(error as Error);
  }
}

export default RegistrationPage;
