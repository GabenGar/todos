import { useState } from "react";
import { createBlockComponent } from "#meta";
import { Button, type IButtonProps } from "./button";

interface IProps
  extends Omit<IButtonProps, "onClick" | "disabled" | "children"> {
  valueToCopy: string;
}

export const ButtonCopy = createBlockComponent(undefined, Component);

function Component({ valueToCopy, ...props }: IProps) {
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
      {!isCopied ? "Copy" : "Copied"}
    </Button>
  );
}
