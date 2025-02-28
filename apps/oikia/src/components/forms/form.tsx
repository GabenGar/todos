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

export interface IFormProps<ActionData>
  extends Omit<FormProps, "children" | "method"> {
  id: string;
  method?: Uppercase<FormMethod>;
  children?: (formID: string) => ReactNode;
  submitButton?: (state: Navigation["state"]) => ReactNode;
  successElement?: (formID: string, data: ActionData) => ReactNode;
}

export function Form<ActionData>({
  id,
  className,
  submitButton,
  successElement,
  children,
  ...props
}: IFormProps<ActionData>) {
  const navigation = useNavigation();
  navigation.state;
  const data = useActionData<ActionData>();
  const formID = `${id}-form`;

  return (
    <div
      id={id}
      className={clsx(
        // @ts-expect-error css modules issue
        baseFormStyles.block,
        className
      )}
    >
      {successElement && data ? (
        <>
          {/*  */}
          <InputSection>
            {
              // @ts-expect-error @TODO better data typing
              successElement(formID, data)
            }
          </InputSection>
          <InputSection>
            <ButtonReset form={formID}>Reset</ButtonReset>
          </InputSection>
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
