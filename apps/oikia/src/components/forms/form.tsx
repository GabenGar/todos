import clsx from "clsx";
import type { ReactNode } from "react";
import {
  type FormProps,
  type Navigation,
  Form as RouterForm,
  useActionData,
  useNavigation,
} from "react-router";
import { ButtonReset, ButtonSubmit } from "@repo/ui/buttons";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { Preformatted } from "@repo/ui/formatting";
import { baseFormStyles } from "@repo/ui/forms";
import { InputSection } from "@repo/ui/forms/sections";
import { List, ListItem } from "@repo/ui/lists";
import { useTranslation } from "#hooks";
import { isFailedAPIResponse } from "#lib/api";
import type { IFormMethod } from "./types";

export interface IFormProps<ActionData>
  extends Omit<FormProps, "children" | "method"> {
  id: string;
  method?: IFormMethod;
  children?: (formID: string) => ReactNode;
  submitButton?: (state: Navigation["state"]) => ReactNode;
  resetButton?:
    | null
    | ((formID: string, state: Navigation["state"]) => ReactNode);
  successElement?: (
    formID: string,
    data: Exclude<ActionData, undefined>,
  ) => ReactNode;
}

export function Form<ActionData>({
  id,
  className,
  submitButton,
  resetButton,
  successElement,
  children,
  ...props
}: IFormProps<ActionData>) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  navigation.state;
  const data = useActionData<ActionData>();
  const formID = `${id}-form`;
  const isSuccessElementVisible = Boolean(
    successElement && data && !isFailedAPIResponse(data),
  );

  return (
    <div
      id={id}
      className={clsx(
        // @ts-expect-error css modules issue
        baseFormStyles.block,
        className,
      )}
    >
      {isSuccessElementVisible ? (
        <>
          <InputSection>
            {
              // biome-ignore lint/style/noNonNullAssertion: dynamic stuff
              successElement!(formID, data as Exclude<ActionData, undefined>)
            }
          </InputSection>

          {resetButton === null ? undefined : resetButton ? (
            resetButton(formID, navigation.state)
          ) : (
            <InputSection>
              <ButtonReset disabled={navigation.state !== "idle"} form={formID}>
                {t((t) => t.common["Reset"])}
              </ButtonReset>
            </InputSection>
          )}
        </>
      ) : (
        <>
          {children?.(formID)}

          <InputSection>
            {navigation.state === "loading" ? (
              t((t) => t.common["Initializing..."])
            ) : navigation.state === "submitting" ? (
              t((t) => t.common["Submitting..."])
            ) : data instanceof Error ? (
              <List isOrdered>
                <ListItem>
                  <Preformatted>{String(data)}</Preformatted>
                </ListItem>
              </List>
            ) : isFailedAPIResponse(data) ? (
              <List isOrdered>
                {data.errors.map(({ name, message }, index) => (
                  <ListItem key={`${index}-${name}-${message}`}>
                    <DescriptionList>
                      <DescriptionSection
                        dKey={t((t) => t.common["Name"])}
                        dValue={<Preformatted>{name}</Preformatted>}
                        isHorizontal
                      />

                      <DescriptionSection
                        dKey={t((t) => t.common["Message"])}
                        dValue={<Preformatted>{message}</Preformatted>}
                        isHorizontal
                      />
                    </DescriptionList>
                  </ListItem>
                ))}
              </List>
            ) : (
              t((t) => t.common["Ready to submit."])
            )}
          </InputSection>

          <InputSection>
            <ButtonSubmit form={formID} disabled={navigation.state !== "idle"}>
              {!submitButton
                ? t((t) => t.common["Submit"])
                : submitButton(navigation.state)}
            </ButtonSubmit>
          </InputSection>
        </>
      )}
      <RouterForm {...props} id={formID} />
    </div>
  );
}
