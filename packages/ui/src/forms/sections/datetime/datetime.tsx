import { createBlockComponent } from "#meta";
import { InputDateTime, type IInputDateTimeProps } from "../../inputs";
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
  return (
    <InputSection {...props}>
      <Label htmlFor={id}>{children}</Label>
      <InputDateTime
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
