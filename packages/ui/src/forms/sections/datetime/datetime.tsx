import { useRef } from "react";
import { createBlockComponent } from "#meta";
import {
  InputDateTime,
  InputHidden,
  type IInputDateTimeProps,
} from "../../inputs";
import { Label } from "../../label";
import { type IInputSectionProps, InputSection } from "../section";

export interface IInputSectionDateTimeProps
  extends Omit<IInputSectionProps, "defaultValue">,
    Pick<IInputDateTimeProps, "defaultValue" | "min" | "max"> {}

export const InputSectionDatetime = createBlockComponent(undefined, Component);

function Component({
  id,
  form,
  name,
  defaultValue,
  min,
  max,
  readOnly,
  required,
  disabled,
  children,
  ...props
}: IInputSectionDateTimeProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <InputSection {...props}>
      <Label htmlFor={id}>{children}</Label>
      <InputDateTime id="" form="" name="" onChange={(event) => {
        const value = event.currentTarget.value
      }} />
      <InputHidden
        ref={inputRef}
        id={id}
        form={form}
        name={name}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        defaultValue={defaultValue}
        min={min}
        max={max}
      />
    </InputSection>
  );
}
