import type { IValidJSONLD } from "../types";

export interface IWebPageJSONLD extends IValidJSONLD {
  "@type": "WebPage";
  url: string;
  mainEntity: {
    "@type": "DiscussionForumPosting";
    url: string;
    identifier: string;
    author: {
      "@type": "Person";
      name: string;
      alternateName: string;
      identifier: string;
      url: string;
    };
    text: string;
    image: string[];
    thumbnailUrl: string;
    datePublished: string;
    interactionStatistic: {
      "@type": "InteractionCounter";
      interactionType: string;
      userInteractionCount: number;
    }[];
    commentCount: number;
    comment: {
      "@type": "Comment";
      url: string;
      identifier: string;
      author: {
        "@type": "Person";
        name: string;
        alternateName: string;
        identifier: string;
        url: string;
        image?: string[];
        thumbnailUrl?: string;
      };
      text: string;
      datePublished: string;
    }[];
  };
}
