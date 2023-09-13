import { createBlockComponent } from "#components/meta";
import type { IBaseComponentPropsWithChildren } from "#components/types";

import styles from "./external.module.scss";

export interface ILinkExternalProps
  extends Omit<IBaseComponentPropsWithChildren<"a">, "href"> {
  href?: URL | string;
}

export const LinkExternal = createBlockComponent(styles, Component);

function Component({ href, ...props }: ILinkExternalProps) {
  const urlString = href instanceof URL ? href.toString() : href;

  return <a href={urlString} {...props} />;
}
