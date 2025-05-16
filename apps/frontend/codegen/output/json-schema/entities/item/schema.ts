/**
 * This module was generated automatically.
 * Do not edit it manually.
 */
export const schema = {
  $id: "/entities/item",
  title: "EntityItem",
  type: "object",
  additionalProperties: false,
  required: ["id", "title"],
  properties: {
    id: {
      $ref: "/strings/nanoid",
    },
    title: {
      $ref: "/strings/title",
    },
  },
} as const;
