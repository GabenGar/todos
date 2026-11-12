import type { IValidJSONLD } from "../types";

export interface IProfilePageJSONLD extends IValidJSONLD {
  "@type": "ProfilePage";
  dateCreated?: string;
  contentRating?: string;
  mainEntity?: {
    "@type": "Person";
    name?: string;
    url?: string;
    alternateName: string;
    additionalName?: string;
    description?: string;
    homeLocation?: { "@type": "Place"; name?: string };
    identifier?: string;
    image?:
      | string
      | {
          "@type": "ImageObject";
          contentUrl?: string;
          thumbnailUrl?: string;
        };
    interactionStatistic?: {
      "@type": "InteractionCounter";
      interactionType?: string;
      name?: string;
      userInteractionCount?: number;
    }[];
    agentInteractionStatistic?: {
      "@type": "InteractionCounter";
      interactionType: string;
      userInteractionCount: number;
    }[];
  };
  hasPart: {
    "@type": "DiscussionForumPosting";
    url?: string;
    identifier?: string;
    author?: {
      "@type": "Person";
      name?: string;
      alternateName?: string;
      identifier?: string;
      url?: string;
    };
    image?: string[];
    thumbnailUrl?: string;
    datePublished?: string;
    interactionStatistic?: {
      "@type": "InteractionCounter";
      interactionType?: string;
      userInteractionCount?: number;
    }[];
    commentCount?: number;
  }[];
}
