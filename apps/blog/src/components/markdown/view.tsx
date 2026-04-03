import Markdown, { type Options } from "react-markdown";

interface IProps extends Pick<Options, "children"> {}

export function MarkdownView({ children }: IProps) {
  return <Markdown>{children}</Markdown>;
}
