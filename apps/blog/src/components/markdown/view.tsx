import clsx from "clsx";
import Markdown, { type Components, type Options } from "react-markdown";
import { Preformatted } from "@repo/ui/formatting";
import { Heading } from "@repo/ui/headings";
import { ListItem, ListOrdered, ListUnordered } from "@repo/ui/lists";
//

import styles from "./view.module.scss";

interface IProps extends Pick<Options, "children"> {}

const components: Components = {
  h1: ({ node, ...props }) => <Heading {...props} level={1} />,
  h2: ({ node, ...props }) => <Heading {...props} level={2} />,
  h3: ({ node, ...props }) => <Heading {...props} level={3} />,
  h4: ({ node, ...props }) => <Heading {...props} level={4} />,
  h5: ({ node, ...props }) => <Heading {...props} level={5} />,
  h6: ({ node, ...props }) => <Heading {...props} level={6} />,
  ul: ({ className, ...props }) => (
    <ListUnordered className={clsx(styles.ul, className)} {...props} />
  ),
  ol: ({ node, ...props }) => <ListOrdered {...props} />,
  li: ({ node, ...props }) => <ListItem {...props} />,
  pre: ({ node, ...props }) => <Preformatted {...props} />,
};

export function MarkdownView({ children }: IProps) {
  return <Markdown components={components}>{children}</Markdown>;
}
