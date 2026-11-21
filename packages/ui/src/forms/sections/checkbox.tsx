import type { Ref } from "react";
import { createBlockComponent } from "#meta";
import { CheckBoxInput, type IICheckBoxInputProps } from "../inputs";
import { Label } from "../label";
import { type IInputSectionProps, InputSection } from "./section";
//

import styles from "./checkbox.module.scss";

interface IInputSectionCheckBoxProps
  extends Omit< IInputSectionProps, "defaultValue" >,
    Pick< IICheckBoxInputProps, "defaultChecked" > {
  inputRef?: Ref< HTMLInputElement >;
}

export const InputSectionCheckBox = createBlockComponent(
  styles.block,
  Component,
);

function Component( {
  id,
  form,
  name,
  defaultChecked,
  readOnly,
  required,
  disabled,
  children,
  inputRef,
  ...props
}: IInputSectionCheckBoxProps ) {
  return (
    <InputSection { ...props }>
      <CheckBoxInput
        ref={ inputRef }
        id={ id }
        className={ styles.input }
        form={ form }
        name={ name }
        required={ required }
        readOnly={ readOnly }
        disabled={ disabled }
        defaultChecked={ defaultChecked }
      />
      <Label className={ styles.label } htmlFor={ id } separator={ "" }>
        { children }
      </Label>
    </InputSection>
  );
}
