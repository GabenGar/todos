import type { ReactNode, SubmitEvent } from "react";
import type { IBaseComponentProps } from "@repo/ui/meta";

export interface IFormProps<InputName extends string = string>
  extends IBaseComponentProps<"form"> {
  id: string;
  children?: (formID: string) => ReactNode;
  isNested?: boolean;
  onSubmit?: (event: IFormEvent<InputName>) => Promise<void>;
  onReset?: (event: IFormEvent<InputName>) => Promise<void>;
  submitButton?: false | ((formID: string) => ReactNode);
}

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
