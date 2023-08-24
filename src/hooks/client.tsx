import { createContext } from "react";

const ClientContext = createContext({});

export function ClientProvider({ children }) {
  return (
    <ClientContext.Provider value="null">{children}</ClientContext.Provider>
  );
}
