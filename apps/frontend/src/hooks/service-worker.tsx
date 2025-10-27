import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { registerServiceWorker } from "#browser/workers";

type IServiceWorkerContext = undefined | ServiceWorker;

const defaultContext = undefined satisfies IServiceWorkerContext;

const ServiceWorkerContext =
  createContext<IServiceWorkerContext>(defaultContext);

interface IProps {
  children: ReactNode;
}

export function ServiceWorkerProvider({ children }: IProps) {
  const [serviceWorker, changeServiceWorker] = useState<ServiceWorker>();

  useEffect(() => {
    if (serviceWorker) {
      return;
    }

    registerServiceWorker().then((nextServiceWorker) => {
      if (!nextServiceWorker) {
        return;
      }

      changeServiceWorker(nextServiceWorker);
    });
  }, []);

  return (
    <ServiceWorkerContext.Provider value={serviceWorker}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}

export function useServiceWorker(): IServiceWorkerContext {
  const context = useContext(ServiceWorkerContext);

  return context;
}
