import { createContext, useContext, type ReactNode, useEffect } from "react";
import { registerServiceWorker } from "#browser/workers";

type IServiceWorkerContext = undefined;

const defaultContext = undefined satisfies IServiceWorkerContext;

const ServiceWorkerContext =
  createContext<IServiceWorkerContext>(defaultContext);

interface IProps {
  children: ReactNode;
}

export function ServiceWorkerProvider({ children }: IProps) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <ServiceWorkerContext.Provider value={undefined}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}

export function useServiceWorker(): IServiceWorkerContext {
  const context = useContext(ServiceWorkerContext);

  return context;
}
