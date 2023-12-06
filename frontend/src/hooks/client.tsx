import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import { useParams } from "next/navigation";
import { DEFAULT_LOG_LEVEL } from "#environment";
import { type ILogLevel, changeCurrentLogLevel } from "#lib/logs";
import {
  getLocalStoreItem,
  isLocalStorageAvailable,
  setLocalStoreItem,
} from "#browser/local-storage";

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
      ) => void;
    };

interface ICompatibility {
  localStorage: boolean;
}

const defaultContext: IClientContext = {
  isClient: false,
};

const ClientContext = createContext<IClientContext>(defaultContext);

export function ClientProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const [isClient, switchIsClient] = useState(false);
  const [locale, changeLocale] = useState<Intl.Locale>();
  const [logLevel, changeLogLevel] = useState<ILogLevel>();
  const [compatibility, changeCompatiblity] = useState<ICompatibility>();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  function switchLogLevel(...args: Parameters<typeof changeCurrentLogLevel>) {
    const newLevel = changeCurrentLogLevel(...args);

    setLocalStoreItem<ILogLevel>("log_level", newLevel);
    changeLogLevel(newLevel);
  }

  useEffect(() => {
    const newCompatibility: ICompatibility = {
      localStorage: isLocalStorageAvailable(),
    };
    const newLogLevel = getLocalStoreItem<ILogLevel>(
      "log_level",
      DEFAULT_LOG_LEVEL,
    );

    changeCompatiblity(newCompatibility);
    changeLogLevel(newLogLevel);
    switchIsClient(true);
  }, []);

  useEffect(() => {
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
      {children}
    </ClientContext.Provider>
  );
}

export function useClient(): IClientContext {
  const context = useContext(ClientContext);

  return context;
}
