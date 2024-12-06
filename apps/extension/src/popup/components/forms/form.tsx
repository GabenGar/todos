"use client";

import type { ReactNode } from "react";
import { Form as RouterForm, FormProps, type FormMethod } from "react-router";
import { createBlockComponent } from "@repo/ui/meta";
import { ButtonSubmit } from "@repo/ui/buttons";
import { InputSection } from "./section";

import styles from "./form.module.scss";

export interface IFormProps extends Omit<FormProps, "children" | "method"> {
  id: string;
  method?: FormMethod;
  children?: (formID: string) => ReactNode;
}

export const Form = createBlockComponent(styles, Component);

function Component({ id, className, children, ...props }: IFormProps) {
  const formID = `${id}-form`;

  return (
    <div id={id} className={className}>
      {children?.(formID)}

      <InputSection className={styles.submit}>
        <ButtonSubmit form={formID}>Submit</ButtonSubmit>
      </InputSection>

      <RouterForm {...props} id={formID} />
    </div>
  );
}
