import type { Route } from "next";
import type { ITask } from "#entities/task";

export const homePageURL = "/" as Route;

export const taskStatsPageURL = "/stats/tasks";

interface ICreateTasksPageURLParams {
  page?: number;
  query?: string;
  status?: ITask["status"];
}

export function createTasksPageURL(
  searchParams?: ICreateTasksPageURLParams,
): Route {
  const urlSearchParams = new URLSearchParams();

  if (searchParams?.page) {
    urlSearchParams.set("page", String(searchParams.page));
  }

  if (searchParams?.query) {
    urlSearchParams.set("query", searchParams.query);
  }

  if (searchParams?.status) {
    urlSearchParams.set("status", searchParams.status);
  }

  urlSearchParams.sort();

  const url = !urlSearchParams.size
    ? "/tasks"
    : `/tasks?${urlSearchParams.toString()}`;

  return url as Route;
}

export function createTaskPageURL(id: ITask["id"]): Route {
  const urlSearchParams = new URLSearchParams([["task_id", id]]).toString();
  const url = `/task?${urlSearchParams}`;

  return url as Route;
}

export function createTaskEditPageURL(id: ITask["id"]): Route {
  const urlSearchParams = new URLSearchParams([["task_id", id]]).toString();
  const url = `/task/edit?${urlSearchParams}`;

  return url as Route;
}

export const qrCodeReaderURL = "/qr-code-reader";

export function createPlacesPageURL(): Route {
  const url = "/places";

  return url as Route;
}
