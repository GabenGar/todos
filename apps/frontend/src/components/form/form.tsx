import clsx from "clsx";
import { type ReactNode, useState } from "react";
import { ButtonSubmit } from "@repo/ui/buttons";
import { logError } from "#lib/logs";
import { isError, validateError } from "#lib/errors";
import type { ILocalizationCommon } from "#lib/localization";
import { createBlockComponent } from "@repo/ui/meta";
import type { IBaseComponentProps } from "#components/types";
import { Pre } from "#components/pre";
import { List, ListItem } from "#components/list";
import { InputSection } from "./section";
import type { IFormEvent } from "./types";

import styles from "./form.module.scss";

export interface IFormProps<InputName extends string = string>
  extends IBaseComponentProps<"form"> {
  commonTranslation: ILocalizationCommon;
  id: string;
  children?: (formID: string, isSubmitting: boolean) => ReactNode;
  isNested?: boolean;
  onSubmit: (event: IFormEvent<InputName>) => Promise<void>;
  onReset?: (event: IFormEvent<InputName>) => Promise<void>;
  // @TODO use `false` instead of `null`
  submitButton?: null | ((formID: string, isSubmitting: boolean) => ReactNode);
  isResetOnSuccess?: boolean;
}

/**
 * @TODO move into ui package
 */
export const Form = createBlockComponent(styles, Component);

function Component<InputName extends string>({
  commonTranslation,
  id,
  isNested,
  className,
  submitButton,
  onSubmit,
  onReset,
  isResetOnSuccess = true,
  children,
  ...props
}: IFormProps<InputName>) {
  const [isSubmitting, switchSubmitting] = useState(false);
  const [errors, changeErrors] = useState<(Error | string)[]>();
  const formID = `${id}-form`;
  const resolvedClassname = clsx(className, isNested && styles.nested);

  async function handleSubmit(event: IFormEvent<InputName>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    switchSubmitting(true);
    changeErrors(undefined);

    try {
      await onSubmit?.(event);

      if (isResetOnSuccess) {
        await handleReset(event);
      }
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
    <div id={id} className={resolvedClassname}>
      {children?.(formID, isSubmitting)}
      {errors && (
        <List isOrdered>
          {errors.map((error, index) => (
            <ListItem key={index}>
              <Pre>{isError(error) ? String(error) : error}</Pre>
            </ListItem>
          ))}
        </List>
      )}

      {
        // don't render the button at all if `null`
        submitButton === null ? undefined : (
          <InputSection className={styles.submit}>
            {/* render default button if not a function */}
            {submitButton === undefined ? (
              <ButtonSubmit
                form={formID}
                viewType={isNested ? "button" : "submit"}
                disabled={isSubmitting}
              >
                {!isSubmitting
                  ? commonTranslation.form.submit
                  : commonTranslation.form.submitting}
              </ButtonSubmit>
            ) : (
              <CustomButton
                formID={formID}
                isNested={isNested}
                isSubmitting={isSubmitting}
                submitButton={submitButton}
              />
            )}
          </InputSection>
        )
      }

      <form
        {...props}
        id={formID}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
    </div>
  );
}

interface ICustomButtonProps extends Pick<IFormProps, "isNested"> {
  formID: string;
  isSubmitting: boolean;
  submitButton: (formID: string, isSubmitting: boolean) => ReactNode;
}

function CustomButton({
  formID,
  isNested,
  isSubmitting,
  submitButton,
}: ICustomButtonProps) {
  const result = submitButton(formID, isSubmitting);

  // render custom button if result is not a string
  if (typeof result !== "string") {
    return <>{result}</>;
  }

  return (
    <ButtonSubmit
      form={formID}
      viewType={isNested ? "button" : "submit"}
      disabled={isSubmitting}
    >
      {result}
    </ButtonSubmit>
  );
}
