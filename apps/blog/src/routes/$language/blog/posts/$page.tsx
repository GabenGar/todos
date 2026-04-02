import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@repo/ui/pages";
import { createPagination } from "@repo/ui/pagination";
import { PreviewList } from "@repo/ui/previews";
import {
  BlogPostPreview,
  getBlogPosts,
  type IBlogPostPreview,
} from "#entities/post";
import { useTranslation } from "#hooks";
import { isSupportedLanguage } from "#translation/lib";

interface IProps {
  posts: IBlogPostPreview[];
}

function PostListPage() {
  const { t } = useTranslation();
  const { posts } = Route.useLoaderData();
  const title = t((t) => t.page.posts.title);
  const heading = t((t) => t.page.posts.heading);
  const pagination = createPagination(String(posts.length));

  return (
    <Page title={title} heading={heading}>
      <PreviewList
        noItemsElement={t((t) => t.page.posts["no-posts-found"])}
        buildURL={() => ""}
        pagination={pagination}
      >
        {posts.map((post) => (
          <BlogPostPreview headingLevel={2} key={post.id} post={post} />
        ))}
      </PreviewList>
    </Page>
  );
}

export const Route = createFileRoute("/$language/blog/posts/$page")({
  component: PostListPage,
  loader: async ({ params }) => {
    const { language } = params;

    if (!isSupportedLanguage(language)) {
      throw new Error(`Unknown locale "${language}".`);
    }

    const posts = await getBlogPosts({ data: { language } });
    const props: IProps = {
      posts,
    };

    return props;
  },
});
