import { Button } from "#components/button";
import { usePageTranslation } from "#hooks";
import { toJSONPretty } from "#lib/json";
import { createDataExport } from "./lib";

export function DataExportForm() {
  const { t } = usePageTranslation("page-account");

  async function handleExportCreation() {
    const dataExport = await createDataExport();
    const dataExportJSON = toJSONPretty(dataExport);
    const blob = new Blob([dataExportJSON], {
      type: "application/json",
    });
    const anchourElement = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const hash = await getHash(dataExportJSON);
    const filename = `data-export-${hash}.json`;

    anchourElement.href = url;
    anchourElement.download = filename;
    anchourElement.click();
  }

  return (
    <Button onClick={handleExportCreation}>{t((t) => t["Export Data"])}</Button>
  );
}

/**
 * @TODO switch to [`hash-wasm`][2]
 * Stolen from [MDN article][1]
 * 
 * [1]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API/Non-cryptographic_uses_of_subtle_crypto.
 * [2]: https://github.com/884882/254565236
 */
async function getHash(data: string) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedData);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashString;
}
