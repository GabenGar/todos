import type { ReactNode } from "react";
import {
  type FormMethod,
  type FormProps as IBaseFormProps,
  type Navigation,
  Form as RouterForm,
  useNavigation,
} from "react-router";
import { ButtonSubmit } from "@repo/ui/buttons";
import { baseFormStyles } from "@repo/ui/forms";
import { InputSection } from "@repo/ui/forms/sections";
import { createBlockComponent } from "@repo/ui/meta";
import { useTranslation } from "#hooks";
//

export interface IFormProps
  extends Omit<IBaseFormProps, "children" | "method"> {
  id: string;
  method?: Uppercase<FormMethod>;
  children?: (formID: string) => ReactNode;
  submitButton?: (state: Navigation["state"]) => ReactNode;
}
export const Form: ReturnType<typeof createBlockComponent<IFormProps>> =
  createBlockComponent(baseFormStyles.block, Component);

function Component({
  id,
  className,
  submitButton,
  children,
  ...props
}: IFormProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const formID = `${id}-form`;

  return (
    <div id={id} className={className}>
      {children?.(formID)}

      <InputSection>
        {navigation.state === "loading"
          ? t((t) => t.form.state.initializing)
          : navigation.state === "submitting"
            ? t((t) => t.form.state.submitting)
            : t((t) => t.form.state.ready)}
      </InputSection>

      <InputSection>
        <ButtonSubmit form={formID} disabled={navigation.state !== "idle"}>
          {!submitButton
            ? t((t) => t.form.submit)
            : submitButton(navigation.state)}
        </ButtonSubmit>
      </InputSection>

      <RouterForm {...props} id={formID} />
    </div>
  );
}
