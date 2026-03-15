import { SITE_TITLE } from "#environment";

export function createMetaTitle(input?: string) {
  return !input ? SITE_TITLE : `${input} | ${SITE_TITLE}`;
}
