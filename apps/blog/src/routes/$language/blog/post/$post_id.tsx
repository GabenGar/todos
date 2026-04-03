import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@repo/ui/pages";
import {
  BlogPostOverview,
  getBlogPostOverview,
  type IBlogPostOverview,
} from "#entities/post";
import { useTranslation } from "#hooks";
import { createMetaTitle } from "#lib/pages";
import { isSupportedLanguage } from "#translation/lib";

interface IProps {
  post: IBlogPostOverview;
}

function PostOverviewPage() {
  const { t } = useTranslation();
  const { post } = Route.useLoaderData();
  const title = createMetaTitle(t((t) => t.page.post.title));
  const heading = t((t) => t.page.post.heading);

  return (
    <Page title={title} heading={heading}>
      <BlogPostOverview headingLevel={2} post={post} />
    </Page>
  );
}

export const Route = createFileRoute("/$language/blog/post/$post_id")({
  component: PostOverviewPage,
  loader: async ({ params }) => {
    const { language, post_id } = params;

    if (!isSupportedLanguage(language)) {
      throw new Error(`Unknown locale "${language}".`);
    }

    const post = await getBlogPostOverview({ data: { id: post_id, language } });
    const props: IProps = {
      post,
    };

    return props;
  },
});
