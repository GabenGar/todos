import { createLink, type LinkComponent } from "@tanstack/react-router";
import { forwardRef } from "react";
import {
  LinkInternal as BaseLinkInternal,
  type ILinkInternalProps,
} from "@repo/ui/links";

interface IProps extends ILinkInternalProps {}

const BaseComponent = forwardRef<HTMLAnchorElement, IProps>((props, ref) => {
  return <BaseLinkInternal ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(BaseComponent);

export const LinkInternal: LinkComponent<typeof BaseComponent> = (props) => {
  return <CreatedLinkComponent {...props} />;
};
