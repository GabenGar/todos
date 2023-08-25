import { type MouseEvent as IReactMouseEvent } from "react";

const VIEW_TYPES = [
  "button",
  "submit",
  "reset",
  "negative",
  "positive",
] as const;

export type IViewType = typeof VIEW_TYPES[number]

export interface IClickEvent
  extends IReactMouseEvent<HTMLButtonElement, MouseEvent> {}
