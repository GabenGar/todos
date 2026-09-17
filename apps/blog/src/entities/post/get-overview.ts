import fs from "node:fs/promises";
import path from "node:path";
import { getSystemErrorName } from "node:util";
import { createServerFn } from "@tanstack/react-start";
import extractGrayMatter from "gray-matter";
import { isFileSystemError } from "@repo/nodejs/fs";
import { IS_DEVELOPMENT } from "#environment";
import type { ILocale } from "#translation";
import { getBlogsFolderPath } from "./lib";
import type { IBlogPostOverview, IBlogPostPreview } from "./types";

interface IData {
  id: IBlogPostOverview["id"];
  language: ILocale;
}

interface IMeta
  extends Pick<
    IBlogPostPreview,
    | "title"
    | "description"
    | "created_at"
    | "edited_at"
    | "published_at"
    | "version"
  > {}

export const getBlogPostOverview = createServerFn({ method: "GET" })
  .inputValidator(({ id, language }: IData) => {
    return { id, language };
  })
  .handler(async ({ data }): Promise<IBlogPostOverview> => {
    const { id, language } = data;

    const filePath = path.join(getBlogsFolderPath(), id, `${language}.md`);

    let markdownContent: string;
    try {
      markdownContent = await fs.readFile(filePath, {
        encoding: "utf8",
      });
    } catch (error) {
      if (
        !isFileSystemError(error) ||
        getSystemErrorName(error.errno) !== "ENOENT"
      ) {
        throw error;
      } else {
        throw new Error(
          `Blog post with ID "${id}" and language "${language}" does not exist.`,
          { cause: error },
        );
      }
    }

    const result = extractGrayMatter(markdownContent);
    const { title, description, created_at, edited_at, published_at, version } =
      result.data as IMeta;
    const overview: IBlogPostOverview = {
      id,
      title,
      description,
      version,
      created_at: !IS_DEVELOPMENT ? undefined : created_at,
      edited_at,
      published_at,
      content: result.content,
    };

    return overview;
  });
