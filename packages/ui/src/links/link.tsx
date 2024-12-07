import { createBlockComponent } from "#meta";
import { type ILinkExternalProps, LinkExternal } from "./external";

const linkTypes = ["internal", "external"] as const;
type ILinkType = (typeof linkTypes)[number];

export type ILinkProps = { linkType: "external" } & ILinkExternalProps;

export const Link = createBlockComponent(undefined, Component);

function Component({ ...props }: ILinkProps) {
  switch (props.linkType) {
    case "external": {
      const { linkType, ...linkProps } = props;

      return <LinkExternal {...linkProps} />;
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
