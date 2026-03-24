import clsx from "clsx";
import type { ReactNode } from "react";
import { ButtonSubmit } from "@repo/ui/buttons";
import { createBlockComponent } from "@repo/ui/meta";
import { useTranslation } from "#hooks";
import { InputSection } from "../sections";
import type { IFormProps } from "./types";
//

import styles from "./form.module.scss";

export const baseFormStyles = styles;

/**
 * Basic wrapper over `<form>` element.
 */
export const Form = createBlockComponent(styles, Component);

function Component<InputName extends string>({
  id,
  isNested,
  className,
  submitButton,
  onSubmit,
  onReset,
  children,
  ...props
}: IFormProps<InputName>) {
  const { t } = useTranslation();
  const formID = `${id}-form`;
  const resolvedClassname = clsx(
    styles.form,
    className,
    isNested && styles.nested,
  );

  return (
    <div id={id} className={resolvedClassname}>
      {children?.(formID)}
      {
        // don't render the button at all if `false`
        submitButton === false ? undefined : (
          <InputSection className={styles.submit}>
            {/* render default button if not a function */}
            {submitButton === undefined ? (
              <ButtonSubmit
                form={formID}
                viewType={isNested ? "button" : "submit"}
              >
                {t((t) => t.form.state.submit)}
              </ButtonSubmit>
            ) : (
              <CustomButton
                formID={formID}
                isNested={isNested}
                submitButton={submitButton}
              />
            )}
          </InputSection>
        )
      }

      <form {...props} id={formID} onSubmit={onSubmit} onReset={onReset} />
    </div>
  );
}

interface ICustomButtonProps extends Pick<IFormProps, "isNested"> {
  formID: string;
  submitButton: (formID: string) => ReactNode;
}

function CustomButton({ formID, isNested, submitButton }: ICustomButtonProps) {
  const result = submitButton(formID);

  // render custom button if result is not a string
  if (typeof result !== "string") {
    return <>{result}</>;
  }

  return (
    <ButtonSubmit form={formID} viewType={isNested ? "button" : "submit"}>
      {result}
    </ButtonSubmit>
  );
}
