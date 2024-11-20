import { createBlockComponent } from "@repo/ui/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./external.module.scss";

export interface ILinkExternalProps
  extends Omit<
    IBaseComponentPropsWithChildren<"a">,
    "href" | "referrerPolicy"
  > {
  href?: URL | string;
}

export const LinkExternal = createBlockComponent(styles, Component);

function Component({ href, target, ...props }: ILinkExternalProps) {
  const urlString = href instanceof URL ? href.toString() : href;

  return (
    <a
      href={urlString}
      target={target ?? "_blank"}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
}
