import type { ReactNode } from "react";
import { Heading } from "#headings";
import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./page.module.scss";

interface IProps extends IBaseComponentPropsWithChildren<"section"> {
  heading?: ReactNode;
}

export const Page = createBlockComponent(styles, Component);

function Component({ children, heading, ...props }: IProps) {
  return (
    <>
      {heading && <Heading level={1}>{heading}</Heading>}
      <section {...props}>{children}</section>
    </>
  );
}
