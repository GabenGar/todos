/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/planned-event/update",
  title: "PlannedEventUpdate",
  type: "object",
  additionalProperties: false,
  required: ["id"],
  minProperties: 2,
  properties: {
    id: {
      $ref: "/numbers/non-negative-integer",
    },
    title: {
      $ref: "/strings/title",
    },
    description: {
      $ref: "/strings/description",
    },
  },
} as const;
