import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createDateTimeFormatter,
  createRelativeDateTimeFormatter,
  type IDateTime,
} from "#dates";
import { createDigitialSizeFormatter } from "#numbers";

type IClientContext =
  | undefined
  | {
      locale: Intl.Locale;
      serverLanguage?: string;
      formatDateTime: (dateTime: IDateTime) => string;
      formatRelativeDateTime: (dateTime: IDateTime) => string;
      formatDigitalSize: (size: number) => string;
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
    const formatDateTime = createDateTimeFormatter(newLocale);
    const formatRelativeDateTime = createRelativeDateTimeFormatter(newLocale);
    const formatDigitalSize = createDigitialSizeFormatter(newLocale);

    const client: IClientContext = {
      locale: newLocale,
      serverLanguage,
      formatDateTime,
      formatRelativeDateTime,
      formatDigitalSize,
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
