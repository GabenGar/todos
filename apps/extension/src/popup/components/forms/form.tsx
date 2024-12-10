import type { ReactNode } from "react";
import {
  Form as RouterForm,
  type FormProps,
  type FormMethod,
  useActionData,
  useNavigation,
  type Navigation,
} from "react-router";
import { createBlockComponent } from "@repo/ui/meta";
import { ButtonSubmit } from "@repo/ui/buttons";
import { Preformatted } from "@repo/ui/formatting";
import { getLocalizedMessage } from "#lib/localization";
import { InputSection } from "./section";

import styles from "./form.module.scss";

export interface IFormProps extends Omit<FormProps, "children" | "method"> {
  id: string;
  method?: FormMethod;
  children?: (formID: string) => ReactNode;
  submitButton?: (state: Navigation["state"]) => ReactNode;
}

export const Form = createBlockComponent(styles, Component);

function Component({
  id,
  className,
  submitButton,
  children,
  ...props
}: IFormProps) {
  const navigation = useNavigation();
  navigation.state;
  const data = useActionData<unknown>();
  const formID = `${id}-form`;

  return (
    <div id={id} className={className}>
      {children?.(formID)}

      <InputSection>
        {navigation.state === "loading" ? (
          getLocalizedMessage("Initializing...")
        ) : navigation.state === "submitting" ? (
          getLocalizedMessage("Submitting...")
        ) : data instanceof Error ? (
          <ol>
            <li>
              <Preformatted>{String(data)}</Preformatted>
            </li>
          </ol>
        ) : (
          getLocalizedMessage("Ready to submit.")
        )}
      </InputSection>

      <InputSection>
        <ButtonSubmit form={formID} disabled={navigation.state !== "idle"}>
          {!submitButton
            ? getLocalizedMessage("Submit")
            : submitButton(navigation.state)}
        </ButtonSubmit>
      </InputSection>

      <RouterForm {...props} id={formID} />
    </div>
  );
}
