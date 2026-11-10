import type { IValidJSONLD } from "../types";

export interface IVideoObjectJSONLD extends IValidJSONLD {
  "@type": "VideoObject";
  name?: string;
  description?: string;
  uploadDate?: string;
  isFamilyFriendly?: boolean;
  url?: string;
  thumbnailUrl?: string;
  duration?: string;
  contentUrl?: string;
  actor?: { "@type": "Person"; name?: string }[];
}
