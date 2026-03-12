import { useState } from "react";
import { useTranslation } from "#hooks";
import { createBlockComponent } from "#meta";
import { Button, type IButtonProps } from "./button";

export interface IButtonCopyProps
  extends Omit<IButtonProps, "onClick" | "disabled" | "children"> {
  valueToCopy: string;
}

export const ButtonCopy = createBlockComponent(undefined, Component);

function Component({ valueToCopy, ...props }: IButtonCopyProps) {
  const { t } = useTranslation();
  const [isCopied, switchCopiedStatus] = useState(false);

  return (
    <Button
      {...props}
      disabled={isCopied}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(valueToCopy);
          switchCopiedStatus(true);
          setTimeout(() => {
            switchCopiedStatus(false);
          }, 3000);
        } catch (error) {
          console.error(error);
        }
      }}
    >
      {t((t) => (!isCopied ? t.button.copy : t.button["copy-success"]))}
    </Button>
  );
}
