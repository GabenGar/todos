import type { SubmitEvent } from "react";
import type { IFormProps } from "./form";

export interface IFormComponentProps extends Pick<IFormProps, "id"> {}

export interface IFormEvent<InputName extends string = string>
  extends SubmitEvent<HTMLFormElement> {
  currentTarget: SubmitEvent<HTMLFormElement>["currentTarget"] & {
    elements: IFormElements<InputName>;
  };
}

export type IFormElements<InputName extends string> =
  HTMLFormControlsCollection & {
    namedItem: (name: InputName) => RadioNodeList | Element | null;
  } & Record<InputName, HTMLInputElement>;
