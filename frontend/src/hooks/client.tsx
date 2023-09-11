import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import { useParams } from "next/navigation";

type IClientContext =
  | {
      isClient: false;
    }
  | {
      isClient: true;
      locale: Intl.Locale;
    };

const defaultContext: IClientContext = {
  isClient: false,
};

const ClientContext = createContext<IClientContext>(defaultContext);

export function ClientProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const [isClient, switchIsClient] = useState(false);
  const [locale, changeLocale] = useState<Intl.Locale>();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;

  useEffect(() => {
    const newLocale = new Intl.Locale(lang);
    switchIsClient(true);
    changeLocale(newLocale);
  }, [lang]);

  return (
    <ClientContext.Provider
      value={!isClient || !locale ? defaultContext : { isClient, locale }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClient(): IClientContext {
  const context = useContext(ClientContext);

  return context;
}
