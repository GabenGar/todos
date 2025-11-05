import {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { IS_SERVICE_WORKER_ENABLED } from "#environment";
import { registerServiceWorker } from "#browser/workers";

type IServiceWorkerContext =
  | IInactiveServiceWorkerContext
  | IActiveServiceWorkerContext;

interface IInactiveServiceWorkerContext {
  status: Extract<
    IServiceWorkerStatus,
    "disabled" | "initializing" | "unavailable" | "error"
  >;
}

interface IActiveServiceWorkerContext {
  status: ServiceWorkerState;
  serviceWorker: ServiceWorker;
}

const defaultContext = (
  IS_SERVICE_WORKER_ENABLED
    ? { status: "initializing" }
    : { status: "disabled" }
) satisfies IServiceWorkerContext;

const ServiceWorkerContext =
  createContext<IServiceWorkerContext>(defaultContext);

interface IProps {
  children: ReactNode;
}

type IServiceWorkerStatus =
  | ServiceWorkerState
  | "initializing"
  | "disabled"
  | "unavailable"
  | "error";

export function ServiceWorkerProvider({ children }: IProps) {
  const [context, changeContext] =
    useState<IServiceWorkerContext>(defaultContext);

  useEffect(() => {
    let worker: ServiceWorker | undefined = undefined;
    navigator.serviceWorker.addEventListener("message", listenForMessages);

    registerServiceWorker().then((nextServiceWorker) => {
      if (!nextServiceWorker) {
        changeContext({ status: "unavailable" });
      } else {
        nextServiceWorker.addEventListener("statechange", listenForState);
        nextServiceWorker.addEventListener("error", listenForErrors);

        worker = nextServiceWorker;
        changeContext({
          status: nextServiceWorker.state,
          serviceWorker: nextServiceWorker,
        });
      }
    });

    return () => {
      worker?.removeEventListener("statechange", listenForState);
      worker?.removeEventListener("error", listenForErrors);
      navigator.serviceWorker.removeEventListener("message", listenForMessages);
    };
  }, []);

  function listenForState(event: Event) {
    const state = (event.target as unknown as { state: ServiceWorkerState })
      .state;

    if (state) {
      changeContext({
        status: state,
        // @ts-expect-error fuck off with these types
        serviceWorker: context.serviceWorker,
      } as IActiveServiceWorkerContext);
    }
  }

  function listenForErrors(event: ErrorEvent) {
    console.error(event.error);
  }

  function listenForMessages(event: MessageEvent) {
    console.log(event.data);
  }

  return (
    <ServiceWorkerContext.Provider value={context}>
      {children}
    </ServiceWorkerContext.Provider>
  );
}

export function useServiceWorker(): IServiceWorkerContext {
  const context = useContext(ServiceWorkerContext);

  return context;
}
