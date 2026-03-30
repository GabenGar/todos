import { createFileRoute } from '@tanstack/react-router'

function PostListPage() {
  return null
}

export const Route = createFileRoute('/$language/blog/posts/$page')({
  component: PostListPage,
})