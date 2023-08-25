import { createContext, type ReactNode } from "react";

const ClientContext = createContext({});

export function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClientContext.Provider value="null">{children}</ClientContext.Provider>
  );
}
