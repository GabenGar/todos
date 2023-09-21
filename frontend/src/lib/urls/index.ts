import type { Route } from "next";

export const homePageURL = "/" as Route;
export function createTasksPageURL(searchParams?: {
  page?: number;
  query?: string;
}): Route {
  const urlSearchParams = new URLSearchParams();

  if (searchParams?.page) {
    urlSearchParams.set("page", String(searchParams.page));
  }

  if (searchParams?.query) {
    urlSearchParams.set("query", String(searchParams.query));
  }

  urlSearchParams.sort();

  const url = !urlSearchParams.size
    ? "/tasks"
    : `/tasks?${urlSearchParams.toString()}`;

  return url as Route;
}
