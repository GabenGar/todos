import type { Route } from "next";
import type { ITask } from "#entities/task";

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

export function createTaskPageURL(id: ITask["id"]): Route {
  return `/task/${id}` as Route;
}
