import path from "node:path";
import { cwd } from "node:process";
import { pgPromise } from "./database";
import type { IEntityRow } from "./types";

const queryFileBasePath = path.join(
  cwd(),
  "src",
  ".server",
  "database",
  "queries"
);

export function getQueryFile(...pathSegments: string[]) {
  const fullPath = path.join(queryFileBasePath, ...pathSegments);
  const queryFile = new pgPromise.QueryFile(fullPath, { minify: true });

  return queryFile;
}

export function toEntityIDs<EntityType extends IEntityRow>(
  entities: EntityType[]
) {
  const ids = entities.map(({ id }) => id);

  return ids;
}
