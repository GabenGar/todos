import { useState } from "react";
import { Button } from "#buttons";
import { createBlockComponent } from "#meta";
import { type IInputPasswordProps, InputPassword } from "../inputs";
import { Label } from "../label";
import { type IInputSectionProps, InputSection } from "./section";
//

import styles from "./password.module.scss";

interface IProps
  extends IInputSectionProps,
    Pick<IInputPasswordProps, "minLength" | "maxLength" | "autoComplete"> {}

export const InputSectionPassword = createBlockComponent(styles, Component);

function Component({
  id,
  name,
  form,
  readOnly,
  required,
  disabled,
  minLength,
  maxLength,
  autoComplete,
  children,
  ...props
}: IProps) {
  const [isShown, switchViewState] = useState<boolean>(false);

  return (
    <InputSection {...props}>
      <Label className={styles.label} htmlFor={id}>
        {children}
      </Label>

      <Button
        className={styles.button}
        onClick={() => switchViewState((old) => !old)}
      >
        {isShown ? "Hide" : "Show"}
      </Button>

      <InputPassword
        id={id}
        className={styles.input}
        name={name}
        type={isShown ? "text" : "password"}
        form={form}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
      />
    </InputSection>
  );
}
