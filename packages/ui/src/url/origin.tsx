import { DescriptionList, DescriptionSection } from "#description-list";
import { Preformatted } from "#formatting";
import { useTranslation } from "#hooks";
import type { IURLViewerProps } from "./viewer";

interface IOriginProps extends Pick<IURLViewerProps, "url"> {}

export function Origin({ url }: IOriginProps) {
  const { t } = useTranslation();
  const { origin, protocol, username, password, host, hostname, port } = url;
  const explicitOrigin = !origin
    ? origin
    : port
      ? origin
      : protocol === "http:"
        ? `${origin}:80`
        : protocol === "https:"
          ? `${origin}:443`
          : origin;
  const explicitPort = port
    ? port
    : protocol === "http:"
      ? "80"
      : protocol === "https:"
        ? "443"
        : port;
  const explicitHost = port
    ? host
    : protocol === "http:"
      ? `${host}:80`
      : protocol === "https:"
        ? `${host}:443`
        : host;

  return (
    <DescriptionList>
      <DescriptionSection
        dKey={t((t) => t.url["Origin"])}
        dValue={<Preformatted>{explicitOrigin}</Preformatted>}
      />

      <DescriptionSection
        dKey={t((t) => t.url["Protocol"])}
        dValue={<Preformatted>{protocol}</Preformatted>}
      />

      {username.length === 0 ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.url["Username"])}
          dValue={<Preformatted>{username}</Preformatted>}
        />
      )}

      {password.length === 0 ? undefined : (
        <DescriptionSection
          dKey={t((t) => t.url["Password"])}
          dValue={<Preformatted>{password}</Preformatted>}
        />
      )}

      {host && (
        <DescriptionSection
          dKey={t((t) => t.url["Host"])}
          dValue={<Preformatted>{explicitHost}</Preformatted>}
        />
      )}

      {hostname && (
        <DescriptionSection
          dKey={t((t) => t.url["Hostname"])}
          dValue={<Preformatted>{hostname}</Preformatted>}
        />
      )}

      {explicitPort && (
        <DescriptionSection
          dKey={t((t) => t.url["Port"])}
          dValue={<Preformatted>{explicitPort}</Preformatted>}
        />
      )}
    </DescriptionList>
  );
}
