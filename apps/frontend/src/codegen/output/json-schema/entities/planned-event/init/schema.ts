/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/planned-event/init",
  title: "PlannedEventInit",
  type: "object",
  additionalProperties: false,
  required: ["title"],
  properties: {
    title: {
      $ref: "/strings/title",
    },
    description: {
      $ref: "/strings/description",
    },
  },
} as const;
