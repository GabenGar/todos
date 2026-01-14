import type { FormEvent } from "react";
import { type IFormProps } from "./form";

export interface IFormComponentProps extends Pick<IFormProps, "id"> {}

export interface IFormEvent<InputName extends string = string>
  extends FormEvent<HTMLFormElement> {
  currentTarget: FormEvent<HTMLFormElement>["currentTarget"] & {
    elements: IFormElements<InputName>;
  };
}

export type IFormElements<InputName extends string> =
  HTMLFormControlsCollection & {
    namedItem: (name: InputName) => RadioNodeList | Element | null;
  } & Record<InputName, HTMLInputElement>;
