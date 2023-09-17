import { createBlockComponent } from "#components/meta";
import { type IInputFileProps, InputFile } from "../input";
import { Label } from "../label";
import { IInputSectionProps, InputSection } from "./section";

import styles from "./file.module.scss";

interface IProps
  extends IInputSectionProps,
    Pick<IInputFileProps, "id" | "form" | "name" | "accept" | "multiple"> {}

export const InputSectionFile = createBlockComponent(styles, Component);

function Component({
  id,
  name,
  form,
  accept,
  multiple,
  defaultValue,
  readOnly,
  required,
  disabled,
  children,
  ...props
}: IProps) {
  return (
    <InputSection {...props}>
      <InputFile
        id={id}
        className={styles.input}
        name={name}
        form={form}
        accept={accept}
        multiple={multiple}
        readOnly={readOnly}
        disabled={disabled}
        required={required}
      />
      <Label className={styles.label} htmlFor={id}>
        {children}
      </Label>
    </InputSection>
  );
}
