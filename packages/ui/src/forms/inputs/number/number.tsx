import { createBlockComponent } from "#meta";
import { type IInputProps, Input } from "../input";

export interface IInputNumberProps
  extends Omit<
    IInputProps,
    "defaultValue" | "minLength" | "maxLength" | "min" | "max" | "step"
  > {
  defaultValue?: number | bigint;
  min?: number | bigint;
  max?: number | bigint;
  step?: number | bigint;
}

export const InputNumber = createBlockComponent(undefined, Component);

function Component({
  min,
  max,
  step,
  defaultValue,
  ...props
}: IInputNumberProps) {
  const normalizedDefaultValue =
    typeof defaultValue === "bigint" ? String(defaultValue) : defaultValue;
  const normalizedMin = typeof min === "bigint" ? String(min) : min;
  const normalizedMax = typeof max === "bigint" ? String(max) : max;
  const normalizedStep = typeof step === "bigint" ? String(step) : step;

  return (
    <Input
      type="number"
      defaultValue={normalizedDefaultValue}
      min={normalizedMin}
      max={normalizedMax}
      step={normalizedStep}
      {...props}
    />
  );
}
