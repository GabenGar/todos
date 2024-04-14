import type { Route } from "next";
import type { ITask } from "#entities/task";
import type { IPlace, IPlacesCategory } from "#entities/place";

export const homePageURL = "/" as Route;

export const notFoundURL = "/404" as Route;

export const taskStatsPageURL = "/stats/tasks";
export const statsPlacesPageURL = "/stats/places";

interface ICreateTasksPageURLParams {
  page?: number;
  query?: string;
  status?: ITask["status"];
  placeID?: IPlace["id"];
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

  if (searchParams?.placeID) {
    urlSearchParams.set("place_id", searchParams.placeID);
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

interface ICreatePlacesPageURLParams {
  page?: number;
  category?: IPlacesCategory;
  query?: string;
}
export function createPlacesPageURL(
  searchParams?: ICreatePlacesPageURLParams,
): Route {
  const urlSearchParams = new URLSearchParams();

  if (searchParams?.page) {
    urlSearchParams.set("page", String(searchParams.page));
  }

  if (searchParams?.category) {
    urlSearchParams.set("category", searchParams.category);
  }

  if (searchParams?.query) {
    urlSearchParams.set("query", searchParams.query);
  }

  urlSearchParams.sort();

  const url = !urlSearchParams.size
    ? "/places"
    : `/places?${urlSearchParams.toString()}`;

  return url as Route;
}

export function createPlacePageURL(id: IPlace["id"]): Route {
  const urlSearchParams = new URLSearchParams([["place_id", id]]).toString();

  const url = `/place?${urlSearchParams}`;

  return url as Route;
}

export function createPlaceEditPageURL(id: IPlace["id"]): Route {
  const urlSearchParams = new URLSearchParams([["place_id", id]]).toString();

  const url = `/place/edit?${urlSearchParams}`;

  return url as Route;
}

export const accountPageURL = "/account";
export const urlViewerPageURL = "/url-viewer";
