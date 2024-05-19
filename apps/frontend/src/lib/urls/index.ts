import type { Route } from "next";
import type { ILocale } from "#lib/internationalization";
import type { ITask } from "#entities/task";
import type { IPlace, IPlacesCategory } from "#entities/place";
import type { IPlannedEvent } from "#entities/planned-event";

export function createHomePageURL(language: ILocale): Route {
  return `/${language}` as Route;
}

export const notFoundURL = "/404" as Route;

export function createTaskStatsPageURL(language: ILocale): Route {
  return `/${language}/stats/tasks` as Route;
}

export function createStatsPlacesPageURL(language: ILocale): Route {
  return `/${language}/stats/places` as Route;
}

interface ICreateTasksPageURLParams {
  page?: number;
  query?: string;
  status?: ITask["status"];
  placeID?: IPlace["id"];
}

export function createTasksPageURL(
  language: ILocale,
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
    ? `/${language}/tasks`
    : `/${language}/tasks?${urlSearchParams.toString()}`;

  return url as Route;
}

export function createTaskPageURL(language: ILocale, id: ITask["id"]): Route {
  const urlSearchParams = new URLSearchParams([["task_id", id]]).toString();
  const url = `/${language}/task?${urlSearchParams}`;

  return url as Route;
}

export function createTaskEditPageURL(
  language: ILocale,
  id: ITask["id"],
): Route {
  const urlSearchParams = new URLSearchParams([["task_id", id]]).toString();
  const url = `/${language}/task/edit?${urlSearchParams}`;

  return url as Route;
}

export function createQRCodeReaderURL(language: ILocale): Route {
  return `/${language}/qr-code-reader` as Route;
}

interface ICreatePlacesPageURLParams {
  page?: number;
  category?: IPlacesCategory;
  query?: string;
}
export function createPlacesPageURL(
  language: ILocale,
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
    ? `/${language}/places`
    : `/${language}/places?${urlSearchParams.toString()}`;

  return url as Route;
}

export function createPlacePageURL(language: ILocale, id: IPlace["id"]): Route {
  const urlSearchParams = new URLSearchParams([["place_id", id]]).toString();

  const url = `/${language}/place?${urlSearchParams}`;

  return url as Route;
}

export function createPlaceEditPageURL(
  language: ILocale,
  id: IPlace["id"],
): Route {
  const urlSearchParams = new URLSearchParams([["place_id", id]]).toString();

  const url = `/${language}/place/edit?${urlSearchParams}`;

  return url as Route;
}

export function createAccountPageURL(language: ILocale): Route {
  return `/${language}/account` as Route;
}
export function createURLViewerPageURL(language: ILocale): Route {
  return `/${language}/url-viewer` as Route;
}

export function createPlannedEventsPageURL(language: ILocale): Route {
  return `/${language}/planned-events` as Route;
}

export function createPlannedEventPageURL(
  language: ILocale,
  id: IPlannedEvent["id"],
): Route {
  const urlSearchParams = new URLSearchParams([
    ["planned_event_id", String(id)],
  ]).toString();

  return `/${language}/planned-event${urlSearchParams}` as Route;
}
