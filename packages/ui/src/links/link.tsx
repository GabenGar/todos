import type { ReactElement } from "react";
import { type ILinkExternalProps, LinkExternal } from "./external";
import { type ILinkInternalProps, LinkInternal } from "./internal";

const linkTypes = ["internal", "external"] as const;
type ILinkType = (typeof linkTypes)[number];
interface ILinkElementProps {
  className?: string;
  children?: ReactElement;
}

export type ILinkProps = ILinkElementProps &
  (
    | {
        internalLinkElement: (props: ILinkElementProps) => ReactElement;
      }
    | ILinkExternalProps
    | ILinkInternalProps
  );

export function Link(props: ILinkProps) {
  if ("internalLinkElement" in props) {
    const { internalLinkElement, ...restProps } = props;

    return internalLinkElement(restProps);
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
