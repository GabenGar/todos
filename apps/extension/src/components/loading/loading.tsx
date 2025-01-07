import { Loading as BaseLoading } from "@repo/ui/loading";
import { getLocalizedMessage } from "#lib/localization";

export function Loading() {
  return <BaseLoading>{getLocalizedMessage("Loading...")}</BaseLoading>;
}
