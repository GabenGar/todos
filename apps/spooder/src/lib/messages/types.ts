import type { IMetaTag } from "#lib/seo";

export type IMessage = IErrorMessage | ISEOMessage;

export interface IErrorMessage {
  type: "error";
  data: Error;
}

export interface ISEOMessage {
  type: "seo";
  data: IMetaTag[];
}
