import { data } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { parseStringValueFromFormData } from "@repo/ui/forms";
import {
  InputSectionPassword,
  InputSectionText,
} from "@repo/ui/forms/sections";
import { runTransaction } from "#database";
import { createServerAction } from "#server/lib/router";
import { loginAccount } from "#server/entities/accounts";
import { commitSession, getSession } from "#server/lib/sessions";
import { createSuccessfullAPIResponse } from "#server/lib/api";
import { LinkInternal } from "#components/link";
import { Form } from "#components/forms";
import type { IAccountLogin } from "#entities/account";

import type { Route } from "./+types/login";

export function meta({ error }: Route.MetaArgs) {
  return [{ title: "Login" }];
}

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders ? loaderHeaders : actionHeaders;
}

function LoginPage({ matches }: Route.ComponentProps) {
  const heading = "Login";
  const formID = "login";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <p>
                Not registered?{" "}
                <LinkInternal href={"/authentication/registration"}>
                  Register.
                </LinkInternal>
              </p>
            </OverviewHeader>

            <OverviewBody>
              <Form<Route.ComponentProps["actionData"]>
                id={formID}
                method="POST"
                submitButton={() => "Login"}
                resetButton={null}
                successElement={(formID, data) => (
                  <>
                    <p>
                      You have successfully logged in, now you can visit
                      <LinkInternal href={"/account"}>
                        account page
                      </LinkInternal>
                      .
                    </p>
                  </>
                )}
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
                      autoComplete="current-password"
                      minLength={8}
                      // https://security.stackexchange.com/q/39849
                      maxLength={49}
                      required
                    >
                      Password
                    </InputSectionPassword>
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

export const action = createServerAction(
  async ({ request }: Route.ActionArgs) => {
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

        const accountLogin: IAccountLogin = {
          login,
          password,
        };

        const { auth_id } = await runTransaction(async (transaction) =>
          loginAccount(transaction, accountLogin)
        );

        const session = await getSession(request.headers.get("Cookie"));

        session.set("auth_id", auth_id);

        const headers = new Headers([
          ["Set-Cookie", await commitSession(session)],
        ]);

        const response = data(createSuccessfullAPIResponse(true), {
          headers,
        });

        return response;
      }

      default: {
        throw new Error(`Unknown method "${request.method}".`);
      }
    }
  }
);

export default LoginPage;
