import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import { useParams } from "next/navigation";
import { DEFAULT_LOG_LEVEL } from "#environment";
import {
  type ILogLevel,
  changeCurrentLogLevel,
  validateLogLevel,
} from "#lib/logs";
import { createLocalStorage, isLocalStorageAvailable } from "#store/local";
import { isIndexedDBAvailable } from "#store/indexed";
import { IndexedDBProvider } from "./indexed-db";

type IClientContext =
  | {
      isClient: false;
    }
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

const defaultContext: IClientContext = {
  isClient: false,
};

const ClientContext = createContext<IClientContext>(defaultContext);
const { get: getLocalStoreLogLevel, set: setLocalStoreLogLevel } =
  createLocalStorage("log_level", DEFAULT_LOG_LEVEL, validateLogLevel);

interface IProps {
  children: ReactNode;
}

export function ClientProvider({ children }: IProps) {
  const params = useParams<{ lang: string }>();
  const [isClient, switchIsClient] = useState(false);
  const [locale, changeLocale] = useState<Intl.Locale>();
  const [logLevel, changeLogLevel] = useState<ILogLevel>();
  const [compatibility, changeCompatiblity] = useState<ICompatibility>();
  const lang = params.lang;

  async function switchLogLevel(
    ...args: Parameters<typeof changeCurrentLogLevel>
  ) {
    const newLevel = changeCurrentLogLevel(...args);
    await setLocalStoreLogLevel(newLevel);
    changeLogLevel(newLevel);
  }

  useEffect(() => {
    (async () => {
      const localStorage = isLocalStorageAvailable();
      const indexedDB = await isIndexedDBAvailable();
      const newCompatibility: ICompatibility = {
        localStorage,
        indexedDB,
      };
      const newLogLevel = await getLocalStoreLogLevel();

      changeCompatiblity(newCompatibility);
      changeLogLevel(newLogLevel);
      switchIsClient(true);
    })();
  }, []);

  useEffect(() => {
    console.log(lang);
    const newLocale = new Intl.Locale(lang);
    changeLocale(newLocale);
  }, [lang]);

  return (
    <ClientContext.Provider
      value={
        !isClient || !locale
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
