import { createBlockComponent } from "#meta";
import { type IInputIntegerProps, InputInteger } from "../../inputs";
import { Label } from "../../label";
import { type IInputSectionProps, InputSection } from "../section";

export interface IInputSectionIntegerProps
  extends Omit<IInputSectionProps, "defaultValue">,
    Pick<IInputIntegerProps, "defaultValue" | "min" | "max"> {}

export const InputSectionInteger = createBlockComponent(undefined, Component);

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
