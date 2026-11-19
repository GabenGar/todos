import { forwardRef, type Ref } from "react";
import { createBlockComponent } from "#meta";
import { type IInputProps, Input } from "./input";

export interface IICheckBoxInputProps
  extends Omit< IInputProps, "defaultValue" | "value" > {}

export const CheckBoxInput = forwardRef<
  HTMLInputElement,
  IICheckBoxInputProps
>( createBlockComponent( undefined, Component ) );

function Component(
  { ...props }: IICheckBoxInputProps,
  ref?: Ref< HTMLInputElement >,
) {
  return <Input ref={ ref } type={ "checkbox" } { ...props } />;
}
