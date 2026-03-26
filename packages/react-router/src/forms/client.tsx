import { Form as RouterForm, useActionData, useNavigation } from "react-router";
import { ButtonSubmit } from "@repo/ui/buttons";
import { Preformatted } from "@repo/ui/formatting";
import { baseFormStyles } from "@repo/ui/forms";
import { InputSection } from "@repo/ui/forms/sections";
import { List, ListItem } from "@repo/ui/lists";
import { createBlockComponent } from "@repo/ui/meta";
import { useTranslation } from "#hooks";
import type { IFormProps } from "./form";
//

export interface IFormClientProps extends IFormProps {}

export const FormClient: ReturnType<
  typeof createBlockComponent<IFormClientProps>
> = createBlockComponent(baseFormStyles.block, Component);

function Component({
  id,
  className,
  submitButton,
  children,
  ...props
}: IFormProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const data = useActionData() as unknown;
  const formID = `${id}-form`;

  return (
    <div id={id} className={className}>
      {children?.(formID)}

      <InputSection>
        {navigation.state === "loading" ? (
          t((t) => t.form.state.initializing)
        ) : navigation.state === "submitting" ? (
          t((t) => t.form.state.submitting)
        ) : data instanceof Error ? (
          <List isOrdered>
            <ListItem>
              <Preformatted>{String(data)}</Preformatted>
            </ListItem>
          </List>
        ) : (
          t((t) => t.form.state.ready)
        )}
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
