import fs from "node:fs/promises";
import path from "node:path";
import { createServerFn } from "@tanstack/react-start";
import extractGrayMatter from "gray-matter";
import type { ILocale } from "#translation/lib";
import { getBlogsFolderPath } from "./lib";
import type { IBlogPostOverview, IBlogPostPreview } from "./types";

interface IData {
  id: IBlogPostOverview["id"];
  language: ILocale;
}

interface IMeta
  extends Pick<
    IBlogPostPreview,
    "title" | "description" | "created_at" | "edited_at" | "published_at"
  > {}

export const getBlogPostOverview = createServerFn({ method: "GET" })
  .inputValidator(({ id, language }: IData) => {
    return { id, language };
  })
  .handler(async ({ data }): Promise<IBlogPostOverview> => {
    const { id, language } = data;

    const filePath = path.join(getBlogsFolderPath(), id, `${language}.md`);

    const markdownContent = await fs.readFile(filePath, {
      encoding: "utf8",
    });
    const result = extractGrayMatter(markdownContent);
    const { title, description, created_at, edited_at, published_at } =
      result.data as IMeta;
    const overview: IBlogPostOverview = {
      id,
      title,
      description,
      created_at,
      edited_at,
      published_at,
      content: result.content,
    };

    return overview;
  });
