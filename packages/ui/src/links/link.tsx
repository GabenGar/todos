import { createBlockComponent } from "#meta";
import { type ILinkExternalProps, LinkExternal } from "./external";
import { type ILinkInternalProps, LinkInternal } from "./internal";

const linkTypes = ["internal", "external"] as const;
type ILinkType = (typeof linkTypes)[number];

export type ILinkProps = { InternalLinkComponent?: typeof LinkInternal } & (
  | ILinkExternalProps
  | ILinkInternalProps
);

export const Link = createBlockComponent(undefined, Component);

function Component({ ...props }: ILinkProps) {
  const linkType = guessLinkType(props.href);

  switch (linkType) {
    case "external": {
      const { ...linkProps } = props;

      return <LinkExternal {...linkProps} />;
    }

    case "internal": {
      const { InternalLinkComponent = LinkInternal, ...linkProps } = props;

      return <InternalLinkComponent {...linkProps} />;
    }

    default: {
      throw new Error(`Illegal link type "${linkType satisfies never}"`);
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
