import { createMetaTitleFunction } from "@repo/ui/pages";
import { SITE_TITLE } from "#environment";

export const createMetaTitle = createMetaTitleFunction(SITE_TITLE);
