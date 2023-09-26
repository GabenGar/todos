import { createBlockComponent } from "#components/meta";
import { type IBaseComponentPropsWithChildren } from "#components/types";
import { type IInputProps } from "./input";

export interface IInputSelectProps
  extends Omit<
      IBaseComponentPropsWithChildren<"select">,
      "id" | "name" | "form"
    >,
    Pick<IInputProps, "id" | "name" | "form"> {}
export interface IInputOptionProps
  extends IBaseComponentPropsWithChildren<"option"> {}

export interface IInputOptionGroupProps
  extends IBaseComponentPropsWithChildren<"optgroup"> {}

export const InputSelect = createBlockComponent(undefined, SelectComponent);
export const InputOption = createBlockComponent(undefined, OptionComponent);
export const InputOptionGroup = createBlockComponent(
  undefined,
  OptionGroupComponent,
);

function SelectComponent({ ...props }: IInputSelectProps) {
  return <select {...props} />;
}

function OptionComponent({ ...props }: IInputOptionProps) {
  return <option {...props} />;
}

function OptionGroupComponent({ ...props }: IInputOptionGroupProps) {
  return <optgroup {...props} />;
}
