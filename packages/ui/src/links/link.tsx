import type { ReactNode } from "react";
import { type ILinkExternalProps, LinkExternal } from "./external";
import { type ILinkInternalProps, LinkInternal } from "./internal";

const linkTypes = ["internal", "external"] as const;
type ILinkType = (typeof linkTypes)[number];

export interface ILinkElementProps {
  className?: string;
  children?: ReactNode;
}

export type ILinkProps = {
  internalLinkElement?: (props: ILinkElementProps) => ReactNode;
} & (ILinkExternalProps | ILinkInternalProps);

export function Link(props: ILinkProps) {
  if (
    "internalLinkElement" in props &&
    props.internalLinkElement !== undefined
  ) {
    const { internalLinkElement, className, children } = props;

    return internalLinkElement({ className, children });
  }

  const linkType = guessLinkType(props.href);

  switch (linkType) {
    case "external": {
      return <LinkExternal {...props} />;
    }

    case "internal": {
      return <LinkInternal {...props} />;
    }

    default: {
      throw new Error(`Illegal link type "${linkType satisfies never}"`);
    }
  }
}

function guessLinkType(href: ILinkExternalProps["href"]): ILinkType {
  if (typeof href === "undefined" || href instanceof URL) {
    return "external";
  }

  if (typeof href === "string" && href.startsWith("http")) {
    return "external";
  }

  return "internal";
}
