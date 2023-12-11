import { LOCAL_STORAGE_KEYS } from "./types";

/**
 * @link
 * [Using_the_Web_Storage_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage)
 */
export function isLocalStorageAvailable() {
  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.STORAGE_TEST,
      LOCAL_STORAGE_KEYS.STORAGE_TEST,
    );
    localStorage.removeItem(LOCAL_STORAGE_KEYS.STORAGE_TEST);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      localStorage?.length !== 0
    );
  }
}
