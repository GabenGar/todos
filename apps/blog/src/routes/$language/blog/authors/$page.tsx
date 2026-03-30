import { createFileRoute } from '@tanstack/react-router'

function AuthorListPage() {
  return null
}

export const Route = createFileRoute('/$language/blog/authors/$page')({
  component: AuthorListPage,
})