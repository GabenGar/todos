import { createBlockComponent } from "#components/meta";
import { InputText } from "../input";
import { Label } from "../label";
import { IInputSectionProps, InputSection } from "./section";

interface IProps
  extends IInputSectionProps,
    Pick<HTMLInputElement, "minLength" | "maxLength"> {}

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
