import fs from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";
import { createServerFn } from "@tanstack/react-start";
import extractGrayMatter from "gray-matter";
import type { ILocale } from "#translation/lib";
import type { IBlogPostItem, IBlogPostPreview } from "./types";

interface IData {
  language: ILocale;
}

interface IMeta
  extends Pick<
    IBlogPostPreview,
    "title" | "description" | "created_at" | "edited_at" | "published_at"
  > {}

export const getBlogPosts = createServerFn({ method: "GET" })
  .inputValidator(({ language }: IData) => {
    return { language };
  })
  .handler(async ({ data }): Promise<IBlogPostPreview[]> => {
    const { language } = data;
    const ids = await collectBlogPostIDs();
    const previews = await getBlogPostsInfo(ids, language);

    return previews;
  });

async function collectBlogPostIDs(): Promise<IBlogPostItem["id"][]> {
  const blogPostsFolderPath = getBlogsFolder();

  const blogPostsFolder = await fs.opendir(blogPostsFolderPath);
  const ids: IBlogPostItem["id"][] = [];

  for await (const entry of blogPostsFolder) {
    if (!entry.isDirectory()) {
      throw new Error("Invalid directory entry type in the blog folder.");
    }

    ids.push(entry.name);
  }

  return ids;
}

function getBlogsFolder() {
  return path.join(cwd(), "src", "blog");
}

async function getBlogPostsInfo(
  ids: IBlogPostItem["id"][],
  language: ILocale,
): Promise<IBlogPostPreview[]> {
  const previews: IBlogPostPreview[] = [];

  for await (const id of ids) {
    const blogPostFilePath = path.join(getBlogsFolder(), id, `${language}.md`);

    try {
      const markdownContent = await fs.readFile(blogPostFilePath, {
        encoding: "utf8",
      });
      const { title, description, created_at, edited_at, published_at } =
        extractGrayMatter(markdownContent).data as IMeta;
      const preview: IBlogPostPreview = {
        id,
        title,
        description,
        created_at,
        edited_at,
        published_at,
      };
      
      previews.push(preview);
    } catch (_error) {
      // @TODO filter for ENOENT error
    }
  }

  return previews;
}
