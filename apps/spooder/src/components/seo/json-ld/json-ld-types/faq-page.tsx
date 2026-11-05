import { useTranslation } from "#hooks";
import type { IFAQPageJSONLD } from "#lib/seo/json-ld";

interface IFAQPageProps {
  jsonLD: IFAQPageJSONLD;
}

export function FAQPageJSONLD({ jsonLD }: IFAQPageProps) {
  const {t} = useTranslation()
  return <></>;
}
