import { logDebug } from "#lib/logs";
import { createBlockComponent } from "#components/meta";
import { type ILinkExternalProps, LinkExternal } from "./external";
import { type ILinkInternalProps, LinkInternal } from "./internal";

const linkTypes = ["internal", "external"] as const;
type ILinkType = (typeof linkTypes)[number];

export type ILinkProps<RouteInferType = undefined> =
  | ({ linkType?: "external" } & ILinkExternalProps)
  | ({ linkType?: "internal" } & ILinkInternalProps<RouteInferType>);

export const Link = createBlockComponent(undefined, Component);

function Component<RouteInferType>({ ...props }: ILinkProps<RouteInferType>) {
  if (!props.linkType) {
    props.linkType = guessLinkType(props.href);
  }

  logDebug(`HREF "${props.href}" is of type "${props.linkType}"`);

  switch (props.linkType) {
    case "external": {
      const { linkType, ...linkProps } = props;

      return <LinkExternal {...linkProps} />;
    }

    case "internal": {
      const { linkType, ...linkProps } = props;

      return <LinkInternal<RouteInferType> {...linkProps} />;
    }

    default: {
      throw new Error(`Illegal link type "${props.linkType satisfies never}"`);
    }
  }
}

function guessLinkType(href: ILinkProps["href"]): ILinkType {
  if (typeof href === "undefined" || href instanceof URL) {
    return "external";
  }

  if (typeof href === "string" && href.startsWith("http")) {
    return "external";
  }

  return "internal";
}
