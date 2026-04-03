import path from "node:path";
import { cwd } from "node:process";

export function getBlogsFolderPath() {
  return path.join(cwd(), "src", "blog");
}