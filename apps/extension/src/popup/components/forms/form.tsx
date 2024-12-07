import type { ReactNode } from "react";
import {
  Form as RouterForm,
  FormProps,
  type FormMethod,
  useActionData,
  useNavigation,
} from "react-router";
import { createBlockComponent } from "@repo/ui/meta";
import { ButtonSubmit } from "@repo/ui/buttons";
import { InputSection } from "./section";

import styles from "./form.module.scss";
import { Preformatted } from "@repo/ui/formatting";

export interface IFormProps extends Omit<FormProps, "children" | "method"> {
  id: string;
  method?: FormMethod;
  children?: (formID: string) => ReactNode;
}

export const Form = createBlockComponent(styles, Component);

function Component({ id, className, children, ...props }: IFormProps) {
  const navigation = useNavigation();
  const data = useActionData<unknown>();
  const formID = `${id}-form`;

  return (
    <div id={id} className={className}>
      {children?.(formID)}

      <InputSection>
        {navigation.state === "loading" ? (
          <>Initializing...</>
        ) : navigation.state === "submitting" ? (
          <>Submitting...</>
        ) : data instanceof Error ? (
          <ol>
            <li>
              <Preformatted>{String(data)}</Preformatted>
            </li>
          </ol>
        ) : (
          <>Ready to submit.</>
        )}
      </InputSection>

      <InputSection>
        <ButtonSubmit form={formID} disabled={navigation.state !== "idle"}>
          Submit
        </ButtonSubmit>
      </InputSection>

      <RouterForm {...props} id={formID} />
    </div>
  );
}
