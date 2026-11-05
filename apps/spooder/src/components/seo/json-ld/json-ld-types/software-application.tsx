import { useTranslation } from "#hooks";
import type { ISoftwareApplicationJSONLD } from "#lib/seo/json-ld";

interface ISoftwareApplicationProps {
  jsonLD: ISoftwareApplicationJSONLD;
}

export function SoftwareApplicationJSONLD({
  jsonLD,
}: ISoftwareApplicationProps) {
  const { t } = useTranslation();
  return <></>;
}
