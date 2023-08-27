import { nanoid } from "nanoid";
import { toJSON, toJSONPretty } from "#lib/json";
import { IArticleProps } from "#components/article";
import { createBlockComponent } from "#components/meta";
import { Article, ArticleHeader } from "#components/article";
import { Button } from "#components/button";
import { createDataExport } from "./lib";

interface IProps extends IArticleProps {}

export const DataExportForm = createBlockComponent(undefined, Component);

function Component({ ...props }: IProps) {
  return (
    <Article {...props}>
      <ArticleHeader>
        <Button
          onClick={async () => {
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
          }}
        >
          Export
        </Button>
      </ArticleHeader>
    </Article>
  );
}

/**
 * Stolen from [MDN article](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API/Non-cryptographic_uses_of_subtle_crypto).
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
