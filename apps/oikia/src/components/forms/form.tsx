import clsx from "clsx";
import type { ReactNode } from "react";
import {
  useNavigation,
  type Navigation,
  Form as RouterForm,
  type FormProps,
  type FormMethod,
  useActionData,
} from "react-router";
import { ButtonReset, ButtonSubmit } from "@repo/ui/buttons";
import { Preformatted } from "@repo/ui/formatting";
import { baseFormStyles } from "@repo/ui/forms";
import { InputSection } from "@repo/ui/forms/sections";
import { List, ListItem } from "@repo/ui/lists";
import { DescriptionList, DescriptionSection } from "@repo/ui/description-list";
import { isFailedAPIResponse } from "#lib/api";

export interface IFormProps<ActionData>
  extends Omit<FormProps, "children" | "method"> {
  id: string;
  method?: Uppercase<FormMethod>;
  children?: (formID: string) => ReactNode;
  submitButton?: (state: Navigation["state"]) => ReactNode;
  resetButton?:
    | null
    | ((formID: string, state: Navigation["state"]) => ReactNode);
  successElement?: (formID: string, data: ActionData) => ReactNode;
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
  const navigation = useNavigation();
  navigation.state;
  const data = useActionData<ActionData>();
  const formID = `${id}-form`;
  const isSuccessElementVisible =
    successElement && data && !isFailedAPIResponse(data);

  return (
    <div
      id={id}
      className={clsx(
        // @ts-expect-error css modules issue
        baseFormStyles.block,
        className
      )}
    >
      {isSuccessElementVisible ? (
        <>
          <InputSection>
            {
              // @ts-expect-error @TODO better data typing
              successElement(formID, data)
            }
          </InputSection>

          {resetButton === null ? undefined : resetButton ? (
            resetButton(formID, navigation.state)
          ) : (
            <InputSection>
              <ButtonReset disabled={navigation.state !== "idle"} form={formID}>
                Reset
              </ButtonReset>
            </InputSection>
          )}
        </>
      ) : (
        <>
          {children?.(formID)}

          <InputSection>
            {navigation.state === "loading" ? (
              "Initializing..."
            ) : navigation.state === "submitting" ? (
              "Submitting..."
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
                        dKey="Name"
                        dValue={<Preformatted>{name}</Preformatted>}
                        isHorizontal
                      />

                      <DescriptionSection
                        dKey="Message"
                        dValue={<Preformatted>{message}</Preformatted>}
                        isHorizontal
                      />
                    </DescriptionList>
                  </ListItem>
                ))}
              </List>
            ) : (
              "Ready to submit."
            )}
          </InputSection>

          <InputSection>
            <ButtonSubmit form={formID} disabled={navigation.state !== "idle"}>
              {!submitButton ? "Submit" : submitButton(navigation.state)}
            </ButtonSubmit>
          </InputSection>
        </>
      )}
      <RouterForm {...props} id={formID} />
    </div>
  );
}
