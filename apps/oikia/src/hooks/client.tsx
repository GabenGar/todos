import { useClient as useBaseClient } from "@repo/ui/hooks";

export function useClient(): ReturnType<typeof useBaseClient> {
  return useBaseClient();
}
