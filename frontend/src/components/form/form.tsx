"use client";

import { type ReactNode, useState } from "react";
import { logError } from "#lib/logs";
import { isError, validateError } from "#lib/errors";
import { createBlockComponent } from "#components/meta";
import type { IBaseComponentProps } from "#components/types";
import type { IFormEvent } from "./types";

import styles from "./form.module.scss";

export interface IFormProps<InputName extends string = string>
  extends IBaseComponentProps<"form"> {
  id: string;
  children?: (formID: string) => ReactNode;
  onSubmit: (event: IFormEvent<InputName>) => Promise<void>;
  onReset?: (event: IFormEvent<InputName>) => Promise<void>;
}

/**
 * @TODO submit button
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
  const [errors, changeErrors] = useState<(Error | string)[]>();
  const formID = `${id}-form`;

  async function handleSubmit(event: IFormEvent<InputName>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    switchSubmitting(true);
    changeErrors(undefined);

    try {
      await onSubmit?.(event);
      await handleReset(event);
    } catch (error) {
      validateError(error);
      logError(error);
      changeErrors([error]);
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
      {errors && (
        <ol>
          {errors.map((error, index) => (
            <li key={index}>
              <pre className={styles.pre}>
                {isError(error) ? String(error) : error}
              </pre>
            </li>
          ))}
        </ol>
      )}
      <form
        {...props}
        id={formID}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
    </div>
  );
}
