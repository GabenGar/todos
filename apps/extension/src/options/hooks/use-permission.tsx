import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

export function useAdditionalPermission() {
  const [hasPermission, setHasPermission] = useState(true);

  const permissions = {
    origins: [
      "http://*/*",
      "https://*/*",
      "<all_urls>"
    ]
  };

  const checkPermission = async () => {
    const hasPermission = await browser.permissions.contains(permissions);
    setHasPermission(hasPermission);
  }

  const requestPermission = async () => {
    await browser.permissions.request(permissions);
    checkPermission();
  }

  useEffect(() => {
    checkPermission();
  }, []);

  return [hasPermission, requestPermission];
}
