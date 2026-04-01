import Markdown from 'react-markdown'

interface IProps {
  content: string;
}

export function MarkdownView({ content }: IProps) {
  return <Markdown>{content}</Markdown>
}
