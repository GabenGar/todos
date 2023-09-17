import { createBlockComponent } from "#components/meta";
import { type IInputTextProps, InputText } from "../input";
import { Label } from "../label";
import { type IInputSectionProps, InputSection } from "./section";

interface IProps
  extends IInputSectionProps,
    Pick<IInputTextProps, "minLength" | "maxLength"> {}

export const InputSectionText = createBlockComponent(undefined, Component);

function Component({
  id,
  form,
  name,
  defaultValue,
  readOnly,
  required,
  disabled,
  minLength,
  maxLength,
  children,
  ...props
}: IProps) {
  return (
    <InputSection {...props}>
      <Label htmlFor={id}>{children}</Label>
      <InputText
        id={id}
        form={form}
        name={name}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        defaultValue={defaultValue}
      />
    </InputSection>
  );
}
