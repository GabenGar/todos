import { type ReactNode } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import { IInputSelectProps, InputSelect } from "../input";
import { Label } from "../label";
import { type IInputSectionProps, InputSection } from "./section";

interface IProps
  extends IInputSectionProps,
    Pick<IInputSelectProps, "multiple" | "size"> {
  label: ReactNode;
}

export const InputSectionSelect = createBlockComponent(undefined, Component);

function Component({
  id,
  form,
  name,
  label,
  defaultValue,
  required,
  disabled,
  children,
  multiple,
  size,
  ...props
}: IProps) {
  return (
    <InputSection {...props}>
      <Label htmlFor={id}>{label}</Label>
      <InputSelect
        id={id}
        form={form}
        name={name}
        required={required}
        disabled={disabled}
        multiple={multiple}
        size={size}
        defaultValue={defaultValue}
      >
        {children}
      </InputSelect>
    </InputSection>
  );
}
