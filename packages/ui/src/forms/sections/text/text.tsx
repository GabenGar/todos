import type { Ref } from "react";
import { createBlockComponent } from "#meta";
import { type IInputTextProps, InputText, InputTextArea } from "../../inputs";
import type { IInputTextAreaProps } from "../../inputs/text/text-area";
import { Label } from "../../label";
import { type IInputSectionProps, InputSection } from "../section";

export interface IInputSectionTextProps
  extends IInputSectionProps,
    Pick<IInputTextProps, "minLength" | "maxLength">,
    Pick<IInputTextAreaProps, "rows"> {
  inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
}

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
  inputRef,
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
          // @ts-expect-error probably easier to use single row
          // `<textarea>` for all text down the line
          ref={inputRef}
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
          // @ts-expect-error probably easier to use single row
          // `<textarea>` for all text down the line
          ref={inputRef}
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
