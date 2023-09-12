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

type IClientContext =
  | {
      isClient: false;
    }
  | {
      isClient: true;
      locale: Intl.Locale;
      logLevel: ILogLevel;
      changeLoglevel: (
        ...args: Parameters<typeof changeCurrentLogLevel>
      ) => void;
    };

const defaultContext: IClientContext = {
  isClient: false,
};

const ClientContext = createContext<IClientContext>(defaultContext);

export function ClientProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const [isClient, switchIsClient] = useState(false);
  const [locale, changeLocale] = useState<Intl.Locale>();
  const [logLevel, changeLogLevel] = useState<ILogLevel>(DEFAULT_LOG_LEVEL);
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  function switchLogLevel(...args: Parameters<typeof changeCurrentLogLevel>) {
    const newLevel = changeCurrentLogLevel(...args);
    changeLogLevel(newLevel);
  }

  useEffect(() => {
    const newLocale = new Intl.Locale(lang);
    switchIsClient(true);
    changeLocale(newLocale);
  }, [lang]);

  return (
    <ClientContext.Provider
      value={
        !isClient || !locale
          ? defaultContext
          : { isClient, locale, logLevel, changeLoglevel: switchLogLevel }
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
