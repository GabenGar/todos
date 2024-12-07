import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

import styles from "./external.module.scss";

export interface ILinkExternalProps
  extends Omit<
    IBaseComponentPropsWithChildren<"a">,
    "href" | "referrerPolicy" | "target"
  > {
  href?: URL | string;
}

export const LinkExternal = createBlockComponent(styles, Component);

function Component({ href, ...props }: ILinkExternalProps) {
  const urlString = href instanceof URL ? href.toString() : href;

  return (
    <a
      href={urlString}
      {...props}
      rel="noreferrer"
      target="_blank"
      referrerPolicy="no-referrer"
    />
  );
}
