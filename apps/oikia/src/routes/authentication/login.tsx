import { data, href } from "react-router";
import { Page } from "@repo/ui/pages";
import { Overview, OverviewBody, OverviewHeader } from "@repo/ui/articles";
import { parseStringValueFromFormData } from "@repo/ui/forms";
import {
  InputSectionPassword,
  InputSectionText,
} from "@repo/ui/forms/sections";
import { createMetaTitle } from "#lib/router";
import type { ICommonTranslationPageProps } from "#lib/internationalization";
import { runTransaction } from "#database";
import {
  createServerAction,
  getLanguage,
  parseMethod,
} from "#server/lib/router";
import { loginAccount } from "#server/entities/accounts";
import { commitSession, getSession } from "#server/lib/sessions";
import { createSuccessfullAPIResponse } from "#server/lib/api";
import { ClientInputError } from "#server/lib/errors";
import { getTranslation } from "#server/localization";
import { LinkInternal } from "#components/link";
import { Form } from "#components/forms";
import type { IAccountLogin } from "#entities/account";

import type { Route } from "./+types/login";

interface IProps extends ICommonTranslationPageProps<"login"> {}

export function meta({ data }: Route.MetaArgs) {
  // @ts-expect-error cannot fetch translaction
  const { translation } = data;
  const title = createMetaTitle(translation["Login"]);

  return [{ title }];
}

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders ? loaderHeaders : actionHeaders;
}

function LoginPage({ loaderData }: Route.ComponentProps) {
  const { language, commonTranslation, translation } = loaderData;
  const heading = translation["Login"];
  const formID = "login";

  return (
    <Page heading={heading}>
      <Overview headingLevel={2}>
        {() => (
          <>
            <OverviewHeader>
              <p>
                {translation["Not registered?"]}{" "}
                <LinkInternal
                  href={href("/:language/authentication/registration", {
                    language,
                  })}
                >
                  {translation["Register"]}
                </LinkInternal>
                .
              </p>
            </OverviewHeader>

            <OverviewBody>
              <Form<Route.ComponentProps["actionData"]>
                commonTranslation={commonTranslation}
                id={formID}
                method="POST"
                submitButton={() => translation["Login"]}
                resetButton={null}
                successElement={() => (
                  <>
                    <p>
                      {
                        translation[
                          "You have successfully logged in, now you can visit"
                        ]
                      }
                      <LinkInternal
                        href={href("/:language/account", { language })}
                      >
                        {translation["account page"]}
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
                      {translation.form["Login"]}
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
                      {translation.form["Password"]}
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

export async function loader({ params }: Route.LoaderArgs) {
  const language = getLanguage(params);
  const { common: commonTranslation, pages } = await getTranslation(language);
  const translation = pages.login;

  const props: IProps = {
    language,
    commonTranslation,
    translation,
  };

  return props;
}

export const action = createServerAction(
  async ({ request, params }: Route.ActionArgs) => {
    const language = getLanguage(params);
    const { common: commonTranslation, pages } = await getTranslation(language);
    const translation = pages.login;

    parseMethod(request, "POST", commonTranslation);

    const formData = await request.formData();

    let login: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "login");

      if (!value) {
        throw new ClientInputError(translation["Login is required."]);
      }

      if (value.length < 5 && value.length > 20) {
        throw new ClientInputError(translation["Invalid login length."]);
      }

      login = value;
    }

    let password: string | undefined = undefined;
    {
      const value = parseStringValueFromFormData(formData, "password");

      if (!value) {
        throw new ClientInputError(translation["Password is required."]);
      }

      if (value.length < 8 && value.length > 49) {
        throw new ClientInputError(translation["Invalid password length."]);
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
