"use client";
import { type ReactNode, type FormEvent, useState } from "react";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentProps } from "#components/types";
import { IFormEvent } from "./types";

import styles from "./form.module.scss";

export interface IFormProps<InputName extends string = string> extends IBaseComponentProps<"form"> {
  id: string;
  children?: (formID: string) => ReactNode;
  onSubmit: (event: IFormEvent<InputName>) => Promise<void>;
  onReset?: (event: IFormEvent<InputName>) => Promise<void>;
}



/**
 * @TODO Input names generic
 */
export const Form = createBlockComponent(styles, Component);

function Component<InputName extends string>({
  id,
  className,
  onSubmit,
  onReset,
  children,
  ...props
}: IFormProps<InputName>) {
  const [isSubmitting, switchSubmitting] = useState(false);
  const formID = `${id}-form`;

  async function handleSubmit(event: IFormEvent<InputName>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    switchSubmitting(true);

    try {
      await onSubmit?.(event);
      await handleReset(event);
    } catch (error) {
      console.error(error);
    } finally {
      switchSubmitting(false);
    }
  }

  async function handleReset(event: IFormEvent<InputName>) {
    if (isSubmitting) {
      return;
    }

    try {
      switchSubmitting(true);
      await onReset?.(event);
      (event.target as HTMLFormElement).reset();
    } finally {
      switchSubmitting(false);
    }
  }

  return (
    <div id={id} className={className}>
      {children?.(formID)}
      <form
        {...props}
        id={formID}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
    </div>
  );
}
