import { createBlockComponent } from "#components/meta";
import { type IInputTextProps, InputText, InputTextArea } from "../../input";
import { IInputTextAreaProps } from "../../input/text/text-area";
import { Label } from "../../label";
import { type IInputSectionProps, InputSection } from "../section";

export interface IInputSectionTextProps
  extends IInputSectionProps,
    Pick<IInputTextProps, "minLength" | "maxLength">,
    Pick<IInputTextAreaProps, "rows"> {}

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
  rows,
  children,
  ...props
}: IInputSectionTextProps) {
  // render a normal input if constraints fit a value
  // into a single row on a preview component
  const isShort = Boolean(
    minLength && minLength < 22 && maxLength && maxLength < 22,
  );

  return (
    <InputSection {...props}>
      <Label htmlFor={id}>{children}</Label>
      {isShort ? (
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
      ) : (
        <InputTextArea
          id={id}
          form={form}
          name={name}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          defaultValue={defaultValue}
          rows={rows}
        />
      )}
    </InputSection>
  );
}
