import { data, href } from "react-router";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { parseStringValueFromFormData } from "@repo/ui/forms";
import {
  InputSectionPassword,
  InputSectionText,
} from "@repo/ui/forms/sections";
import { Page } from "@repo/ui/pages";
import { Form } from "#components/forms";
import { LinkInternal } from "#components/link";
import { runTransaction } from "#database";
import type { IAccountLogin } from "#entities/account";
import { useTranslation } from "#hooks";
import { createMetaTitle } from "#lib/router";
import { loginAccount } from "#server/entities/accounts";
import { createSuccessfullAPIResponse } from "#server/lib/api";
import { ClientInputError } from "#server/lib/errors";
import {
  createLocalizedLoader,
  createServerAction,
  parseMethod,
} from "#server/lib/router";
import { commitSession, getSession } from "#server/lib/sessions";
//

import type { Route } from "./+types/login";

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders ? loaderHeaders : actionHeaders;
}

function LoginPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { language } = loaderData;
  const title = createMetaTitle(t((t) => t.pages.login["Login"]));
  const heading = t((t) => t.pages.login["Login"]);
  const formID = "login";

  return (
    <Page heading={heading} title={title}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <p>
                {t((t) => t.pages.login["Not registered?"])}{" "}
                <LinkInternal
                  href={href("/:language/authentication/registration", {
                    language,
                  })}
                >
                  {t((t) => t.pages.login["Register"])}
                </LinkInternal>
                .
              </p>
            </OverviewHeader>

            <OverviewBody>
              <Form<Route.ComponentProps["actionData"]>
                id={formID}
                method="POST"
                submitButton={() => t((t) => t.pages.login["Login"])}
                resetButton={null}
                successElement={() => (
                  <>
                    <p>
                      {t(
                        (t) =>
                          t.pages.login[
                            "You have successfully logged in, now you can visit"
                          ],
                      )}
                      <LinkInternal
                        href={href("/:language/account", { language })}
                      >
                        {t((t) => t.pages.login["account page"])}
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
                      {t((t) => t.pages.login.form["Login"])}
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
                      {t((t) => t.pages.login.form["Password"])}
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

export const loader = createLocalizedLoader();

export const action = createServerAction(
  async ({ request, params }: Route.ActionArgs) => {
    parseMethod(request, "POST");

    const formData = await request.formData();

    let login: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "login");

      if (!value) {
        throw new ClientInputError("Login is required.");
      }

      if (value.length < 5 && value.length > 20) {
        throw new ClientInputError("Invalid login length.");
      }

      login = value;
    }

    let password: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "password");

      if (!value) {
        throw new ClientInputError("Password is required.");
      }

      if (value.length < 8 && value.length > 49) {
        throw new ClientInputError("Invalid password length.");
      }

      password = value;
    }

    const accountLogin: IAccountLogin = {
      login,
      password,
    };

    const { auth_id } = await runTransaction(async (transaction) =>
      loginAccount(transaction, accountLogin),
    );

    const session = await getSession(request.headers.get("Cookie"));

    session.set("auth_id", auth_id);

    const headers = new Headers([["Set-Cookie", await commitSession(session)]]);

    const response = data(createSuccessfullAPIResponse(true), {
      headers,
    });

    return response;
  },
);

export default LoginPage;
