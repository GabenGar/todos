import Link, { type LinkProps } from "next/link";
import { createBlockComponent } from "#components/meta";

import styles from "./internal.module.scss";

export interface ILinkInternalProps<RouteInferType>
  extends LinkProps<RouteInferType> {}

export const LinkInternal = createBlockComponent(styles, Component);

function Component<RouteInferType>({
  ...props
}: ILinkInternalProps<RouteInferType>) {
  return <Link<RouteInferType> {...props} />;
}
