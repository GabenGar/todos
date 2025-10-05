export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration =
      await navigator.serviceWorker.register("/service-worker.js");
    console.log(
      `Service Worker registration successful with scope "${registration.scope}".`,
      registration.scope,
    );
  } catch (error) {
    console.error(
      new Error("Service Worker registration failed", { cause: error }),
    );
  }
}
