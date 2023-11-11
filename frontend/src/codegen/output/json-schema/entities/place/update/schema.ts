/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/place/update",
  title: "PlaceUpdate",
  type: "object",
  additionalProperties: false,
  required: ["id"],
  minProperties: 2,
  properties: {
    id: {
      $ref: "/strings/nanoid",
    },
    title: {
      $ref: "/strings/title",
    },
    description: {
      $ref: "/strings/description",
    },
    deleted_at: {
      $ref: "/dates/datetime",
    },
  },
} as const;
