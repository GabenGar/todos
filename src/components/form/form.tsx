"use client";
import { type ReactNode, type FormEvent, useState } from "react";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentProps } from "#components/types";

import styles from "./form.module.scss";

interface IProps extends IBaseComponentProps<"form"> {
  id: string;
  children?: (formID: string) => ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onReset?: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export type IFormElements<InputName extends string> =
  HTMLFormControlsCollection & Record<InputName, HTMLInputElement>;

/**
 * @TODO Input names generic
 */
export const Form = createBlockComponent(styles, Component);

export function Component({
  id,
  className,
  onSubmit,
  onReset,
  children,
  ...props
}: IProps) {
  const [isSubmitting, switchSubmitting] = useState(false);
  const formID = `${id}-form`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

  async function handleReset(event: FormEvent<HTMLFormElement>) {
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
