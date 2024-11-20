import type { ReactNode } from "react";
import { createBlockComponent } from "@repo/ui/meta";
import { Heading } from "./heading";
import type { IBaseComponentPropsWithChildren } from "./types";

import styles from "./page.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"section"> {
  heading?: ReactNode;
}

/**
 * @TODO find a way how to make it a layou thing
 */
export const Page = createBlockComponent(styles, Component);

function Component({ children, heading, ...props }: IProps) {
  return (
    <>
      {heading && <Heading level={1}>{heading}</Heading>}
      <section {...props}>{children}</section>
    </>
  );
}
