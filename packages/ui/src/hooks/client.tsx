import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";

type IClientContext =
  | undefined
  | {
      locale: Intl.Locale;
    };

const defaultContext: IClientContext = undefined;

const ClientContext = createContext<IClientContext>(defaultContext);

interface IProps {
  children: ReactNode;
}

export function ClientProvider({ children }: IProps) {
  const [isClient, switchIsClient] = useState(false);
  const [locale, changeLocale] = useState<Intl.Locale>();

  useEffect(() => {
    //  https://stackoverflow.com/a/57529410
    const localeValue = new Intl.NumberFormat().resolvedOptions().locale;
    const newLocale = new Intl.Locale(localeValue);

    changeLocale(newLocale);
    switchIsClient(true);
  }, []);

  return (
    <ClientContext.Provider
      value={
        !isClient || !locale
          ? defaultContext
          : {
              locale,
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
