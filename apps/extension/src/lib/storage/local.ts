import browser from "webextension-polyfill";
import type { ILocalStorageKey, ILocalStorage } from "./types";

/**
 * @TODO
 * [mapped type](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
 */
export async function getLocalStorageValue(
  storageKey: ILocalStorageKey,
  defaultValue?: ILocalStorage[ILocalStorageKey]
): Promise<ILocalStorage[ILocalStorageKey]> {
  const result = (await browser.storage.local.get({
    [storageKey]: defaultValue,
  })) as {
    [Property in keyof ILocalStorage]: ILocalStorage[ILocalStorageKey];
  };
  const value = result[storageKey];

  return value;
}

export async function setLocalStorageValue(
  storageKey: ILocalStorageKey,
  data: ILocalStorage[ILocalStorageKey]
): Promise<ILocalStorage[ILocalStorageKey]> {
  const updateData = { [storageKey]: data };
  await browser.storage.local.set(updateData);

  const result = await getLocalStorageValue(storageKey);

  return result;
}

export function onLocalStorageChange(
  listener: Parameters<typeof browser.storage.local.onChanged.addListener>[0]
) {
  const cleanup = () => {
    browser.storage.local.onChanged.removeListener(listener);
  };

  browser.storage.local.onChanged.addListener(listener);

  return cleanup;
}
