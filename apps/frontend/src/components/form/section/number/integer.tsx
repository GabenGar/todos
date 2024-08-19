import { createBlockComponent } from "#components/meta";
import { InputInteger, type IInputIntegerProps } from "../../input";
import { Label } from "../../label";
import { type IInputSectionProps, InputSection } from "../section";

export interface IInputSectionIntegerProps
  extends Omit<IInputSectionProps, "defaultValue">,
    Pick<IInputIntegerProps, "min" | "max" | "defaultValue"> {}

export const InputSectionInteger = createBlockComponent(undefined, Component);

function Component({
  id,
  form,
  name,
  defaultValue,
  readOnly,
  required,
  disabled,
  min,
  max,
  children,
  ...props
}: IInputSectionIntegerProps) {
  return (
    <InputSection {...props}>
      <Label htmlFor={id}>{children}</Label>

      <InputInteger
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
