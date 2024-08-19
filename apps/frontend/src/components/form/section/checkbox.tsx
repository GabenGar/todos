import { createBlockComponent } from "#components/meta";
import { InputCheckbox, type IInputCheckboxProps } from "../input";
import { Label } from "../label";
import { type IInputSectionProps, InputSection } from "../section";

export interface IInputSectionCheckboxProps
  extends IInputSectionProps,
    Pick<IInputCheckboxProps, "defaultChecked"> {}

export const InputSectionCheckbox = createBlockComponent(undefined, Component);

function Component({
  id,
  form,
  name,
  defaultValue,
  readOnly,
  required,
  disabled,
  defaultChecked,
  children,
  ...props
}: IInputSectionCheckboxProps) {
  return (
    <InputSection {...props}>
      <Label htmlFor={id}>{children}</Label>

      <InputCheckbox
        id={id}
        form={form}
        name={name}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        defaultValue={defaultValue}
        defaultChecked={defaultChecked}
      />
    </InputSection>
  );
}
