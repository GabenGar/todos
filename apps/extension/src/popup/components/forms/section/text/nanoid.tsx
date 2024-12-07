import { createBlockComponent } from "@repo/ui/meta";
import { InputNanoID } from "../../input";
import { Label } from "../../label";
import { type IInputSectionProps, InputSection } from "../section";

interface IProps extends Omit<IInputSectionProps, "minLength" | "maxLength"> {}

export const InputSectionNanoID = createBlockComponent(undefined, Component);

function Component({
  id,
  form,
  name,
  defaultValue,
  readOnly,
  required,
  disabled,
  children,
  ...props
}: IProps) {
  return (
    <InputSection {...props}>
      <Label htmlFor={id}>{children}</Label>
      <InputNanoID
        id={id}
        form={form}
        name={name}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        defaultValue={defaultValue}
      />
    </InputSection>
  );
}
