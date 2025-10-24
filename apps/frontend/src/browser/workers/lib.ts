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

    return registration
  } catch (error) {
    console.error(
      new Error("Service Worker registration failed", { cause: error }),
    );
  }
}
