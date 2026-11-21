import type { IHashData } from "@repo/core/hashes";

export interface IFileOverview {
  file: File;
  hashes: IHashData;
}
