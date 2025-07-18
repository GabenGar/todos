import { useRef, type ChangeEvent } from "react";
import { TZDate } from "@date-fns/tz";
import { createBlockComponent } from "#meta";
import {
  InputDateTime,
  InputHidden,
  type IInputDateTimeProps,
} from "../../inputs";
import { Label } from "../../label";
import { type IInputSectionProps, InputSection } from "../section";

export interface IInputSectionDateTimeProps
  extends Omit<
      IInputSectionProps,
      "defaultValue" | "readOnly" | "required" | "disabled"
    >,
    Pick<IInputDateTimeProps, "defaultValue" | "min" | "max"> {}

export const InputSectionDatetime = createBlockComponent(undefined, Component);

function Component({
  id,
  form,
  name,
  defaultValue,
  min,
  max,
  children,
  ...props
}: IInputSectionDateTimeProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!inputRef.current) {
      return;
    }

    const value = event.currentTarget.value;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new TZDate(value, timezone);
    const isoDateTime = date.toISOString();

    inputRef.current.value = isoDateTime;
  }

  return (
    <InputSection {...props}>
      <Label htmlFor={id}>{children}</Label>
      <InputDateTime id={id} form="" name="" onChange={handleChange} />
      <InputHidden
        ref={inputRef}
        form={form}
        name={name}
        defaultValue={defaultValue}
        min={min}
        max={max}
      />
    </InputSection>
  );
}
