import { SITE_BASE_PATHNAME } from "#environment";

const serviceWorkerPath = `${SITE_BASE_PATHNAME}/service-worker.js`;

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration =
      await navigator.serviceWorker.register(serviceWorkerPath);
    console.log(
      `Service Worker registration successful with scope "${registration.scope}".`,
    );
  } catch (error) {
    console.error(
      new Error("Service Worker registration failed", { cause: error }),
    );
  }
}
