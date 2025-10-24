import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { registerServiceWorker } from "#browser/workers";

type IServiceWorkerContext = undefined;

const defaultContext = undefined satisfies IServiceWorkerContext;

const ServiceWorkerContext =
  createContext<IServiceWorkerContext>(defaultContext);

interface IProps {
  children: ReactNode;
}

export function ServiceWorkerProvider({ children }: IProps) {
  const [registration, changeRegistration] =
    useState<ServiceWorkerRegistration>();

  useEffect(() => {
    if (registration) {
      return;
    }

    registerServiceWorker().then((nextRegistration) => {
      changeRegistration(nextRegistration);
    });
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
