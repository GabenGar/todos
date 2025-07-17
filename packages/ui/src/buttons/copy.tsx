import { useState } from "react";
import { createBlockComponent, type ITranslationProps } from "#meta";
import { Button, type IButtonProps } from "./button";

export interface IButtonCopyProps
  extends Omit<IButtonProps, "onClick" | "disabled" | "children">,
    ITranslationProps<ITranslationKey> {
  valueToCopy: string;
}

type ITranslationKey = "Copy" | "Copied";

export const ButtonCopy = createBlockComponent(undefined, Component);

function Component({ translation, valueToCopy, ...props }: IButtonCopyProps) {
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
      {!isCopied ? translation["Copy"] : translation["Copied"]}
    </Button>
  );
}
