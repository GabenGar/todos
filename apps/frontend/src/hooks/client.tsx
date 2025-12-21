import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { DEFAULT_LOG_LEVEL } from "#environment";
import {
  type ILogLevel,
  changeCurrentLogLevel,
  validateLogLevel,
} from "#lib/logs";
import type { ILocale } from "#lib/internationalization";
import { createLocalStorage, isLocalStorageAvailable } from "#store/local";
import { isIndexedDBAvailable } from "#store/indexed";
import { registerServiceWorker } from "#browser/workers";
import { IndexedDBProvider } from "./indexed-db";

type IClientContext =
  | undefined
  | {
      isClient: true;
      locale: Intl.Locale;
      logLevel: ILogLevel;
      compatibility: ICompatibility;
      changeLoglevel: (
        ...args: Parameters<typeof changeCurrentLogLevel>
      ) => Promise<void>;
    };

interface ICompatibility {
  localStorage: boolean;
  indexedDB: boolean;
}

const defaultContext = undefined satisfies IClientContext;

const ClientContext = createContext<IClientContext>(defaultContext);
const { get: getLocalStoreLogLevel, set: setLocalStoreLogLevel } =
  createLocalStorage("log_level", DEFAULT_LOG_LEVEL, validateLogLevel);

interface IProps {
  lang: ILocale;
  children: ReactNode;
}

export function ClientProvider({ lang, children }: IProps) {
  const { isReady } = useRouter();
  const [isClient, switchIsClient] = useState(false);
  const [locale, changeLocale] = useState<Intl.Locale>();
  const [logLevel, changeLogLevel] = useState<ILogLevel>();
  const [compatibility, changeCompatiblity] = useState<ICompatibility>();

  async function switchLogLevel(
    ...args: Parameters<typeof changeCurrentLogLevel>
  ) {
    const newLevel = changeCurrentLogLevel(...args);
    await setLocalStoreLogLevel(newLevel);
    changeLogLevel(newLevel);
  }

  useEffect(() => {
    if (!isReady) {
      return;
    }

    (async () => {
      const localStorage = isLocalStorageAvailable();
      const indexedDB = await isIndexedDBAvailable();
      const newCompatibility: ICompatibility = {
        localStorage,
        indexedDB,
      };
      const newLogLevel = await getLocalStoreLogLevel();
      registerServiceWorker();

      changeCompatiblity(newCompatibility);
      changeLogLevel(newLogLevel);
      switchIsClient(true);
    })();
  }, [isReady]);

  useEffect(() => {
    // no idea why is it undefined on the first render
    // despite being a literal prop of the component
    if (!lang) {
      return;
    }

    const newLocale = new Intl.Locale(lang);
    changeLocale(newLocale);
  }, [isClient, lang]);

  return (
    <ClientContext.Provider
      value={
        !isReady || !isClient || !locale
          ? defaultContext
          : {
              isClient,
              locale,
              logLevel: logLevel!,
              changeLoglevel: switchLogLevel,
              compatibility: compatibility!,
            }
      }
    >
      <IndexedDBProvider>{children}</IndexedDBProvider>
    </ClientContext.Provider>
  );
}

export function useClient(): IClientContext {
  const context = useContext(ClientContext);

  return context;
}
