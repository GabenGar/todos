import {
  ClientProvider as BaseClientProvider,
  useClient as useBaseClient,
} from "@repo/ui/hooks";

export const ClientProvider = BaseClientProvider;

export function useClient() {
  return useBaseClient();
}
