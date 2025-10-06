import { SITE_BASE_PATHNAME } from "#environment";

const serviceWorkerPath = `${SITE_BASE_PATHNAME}/service-worker.js`;

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration =
      await navigator.serviceWorker.register(serviceWorkerPath);
    if (registration.installing) {
      console.log("Service worker installing");
    } else if (registration.waiting) {
      console.log("Service worker installed");
    } else if (registration.active) {
      console.log("Service worker active");
    }
    console.log(
      `Service Worker registration successful with scope "${registration.scope}".`,
    );

  } catch (error) {
    console.error(
      new Error("Service Worker registration failed", { cause: error }),
    );
  }
}
