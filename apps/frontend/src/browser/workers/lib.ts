import { IS_SERVICE_WORKER_ENABLED, SITE_BASE_PATHNAME } from "#environment";

const serviceWorkerPath = `${SITE_BASE_PATHNAME}/service-worker.js`;

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  if (!IS_SERVICE_WORKER_ENABLED) {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for await (const registration of registrations) {
      await registration.unregister();
    }

    return;
  }

  try {
    // not using this exact syntax:
    // https://webpack.js.org/blog/2020-10-10-webpack-5-release/#native-worker-support
    // because it creates variable output filename
    // and for service workers to works properly the filename has to be stable
    const registration = await navigator.serviceWorker.register(
      serviceWorkerPath,
      {
        scope: serviceWorkerPath,
      },
    );

    const worker =
      registration.installing ??
      registration.waiting ??
      registration.active ??
      undefined;

    console.log(
      !worker
        ? `Failed to register Service Worker at scope "${registration.scope}" for some reason.`
        : `Service Worker registration successful with scope "${registration.scope}".`,
    );

    return worker;
  } catch (error) {
    console.error(
      new Error("Service Worker registration failed", { cause: error }),
    );
  }
}
