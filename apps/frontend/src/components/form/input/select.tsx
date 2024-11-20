import { createBlockComponent } from "@repo/ui/meta";
import { type IBaseComponentPropsWithChildren } from "#components/types";
import { type IInputProps } from "./input";

import styles from "./select.module.scss";

export interface IInputSelectProps
  extends Omit<
      IBaseComponentPropsWithChildren<"select">,
      "id" | "name" | "form"
    >,
    Pick<IInputProps, "id" | "name" | "form"> {}

// `label` is omitted because it's a legacy attribute
// https://stackoverflow.com/q/3905984/14481500
export interface IInputOptionProps
  extends Omit<IBaseComponentPropsWithChildren<"option">, "label"> {}

export interface IInputOptionGroupProps
  extends IBaseComponentPropsWithChildren<"optgroup"> {}

export const InputSelect = createBlockComponent(styles, SelectComponent);
export const InputOption = createBlockComponent(styles.option, OptionComponent);
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
