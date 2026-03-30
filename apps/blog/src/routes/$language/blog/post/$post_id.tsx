import { createFileRoute } from '@tanstack/react-router'

function PostOverviewPage() {
  return null
}

export const Route = createFileRoute('/$language/blog/post/$post_id')({
  component: PostOverviewPage,
})