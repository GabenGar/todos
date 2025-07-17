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
      serverLanguage?: string;
    };

const defaultContext: IClientContext = undefined;

const ClientContext = createContext<IClientContext>(defaultContext);

interface IProps {
  children: ReactNode;
  serverLanguage?: string;
}

export function ClientProvider({ children, serverLanguage }: IProps) {
  const [client, changeClient] = useState(defaultContext);

  useEffect(() => {
    //  https://stackoverflow.com/a/57529410
    const localeValue =
      serverLanguage ?? new Intl.NumberFormat().resolvedOptions().locale;
    const newLocale = new Intl.Locale(localeValue);

    const client = {
      locale: newLocale,
      serverLanguage,
    };

    changeClient(client);
  }, [serverLanguage]);

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
}

export function useClient(): IClientContext {
  const context = useContext(ClientContext);

  return context;
}
