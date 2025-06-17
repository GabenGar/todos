import {
  createBlockComponent,
  type IBaseComponentPropsWithChildren,
} from "#meta";

export { default as linkInternalStyles } from "./internal.module.scss";

import styles from "./internal.module.scss";

export interface ILinkInternalProps
  extends Omit<IBaseComponentPropsWithChildren<"a">, "href"> {
  href?: URL | string;
}

export const LinkInternal = createBlockComponent(styles, Component);

function Component({ href, ...props }: ILinkInternalProps) {
  const urlString = href instanceof URL ? href.toString() : href;

  return (
    <a
      href={urlString}
      {...props}
    />
  );
}
