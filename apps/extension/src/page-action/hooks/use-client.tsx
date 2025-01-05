import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";

type IClientContext =
  | undefined
  | {
      isClient: true;
    };

const ClientContext = createContext<IClientContext>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [isClient, switchIsClient] = useState(false);

  useEffect(() => {
    switchIsClient(true);
  }, []);

  return (
    <ClientContext.Provider
      value={
        !isClient
          ? undefined
          : {
              isClient,
            }
      }
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClient(): IClientContext {
  const context = useContext(ClientContext);

  return context;
}
