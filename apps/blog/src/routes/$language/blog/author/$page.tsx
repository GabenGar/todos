import { createFileRoute } from '@tanstack/react-router'

function AuthorOverviewPage() {
  return null
}

export const Route = createFileRoute('/$language/blog/author/$page')({
  component: AuthorOverviewPage,
})